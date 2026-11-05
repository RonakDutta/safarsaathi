const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authorization");
const twilio = require("twilio");
const admin = require("../middleware/admin");
require("dotenv").config();

const twilioSid = process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_SID;
const client = twilio(twilioSid, process.env.TWILIO_AUTH_TOKEN);

const realBooking =
  "NOT (payment_method = 'Online' AND payment_status = 'unpaid')";

router.get("/stats", authorize, admin, async (req, res) => {
  try {
    const bookingCount = await pool.query(
      `SELECT COUNT(*) FROM bookings WHERE ${realBooking}`,
    );
    const driverCount = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role = 'driver'",
    );
    const appCount = await pool.query(
      "SELECT COUNT(*) FROM driver_applications WHERE status = 'pending'",
    );
    const revenue = await pool.query(
      "SELECT SUM(amount) AS total FROM bookings WHERE status = 'completed'",
    );

    res.json({
      totalBookings: bookingCount.rows[0].count,
      activeDrivers: driverCount.rows[0].count,
      pendingApps: appCount.rows[0].count,
      revenue: revenue.rows[0].total || 0,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/bookings", authorize, admin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM bookings WHERE ${realBooking} ORDER BY created_at DESC`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

router.delete("/bookings/:id", authorize, admin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM bookings WHERE booking_id = $1", [id]);
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/applications", authorize, admin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM driver_applications ORDER BY applied_at DESC",
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

router.put("/applications/:id", authorize, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== "approved" && status !== "rejected") {
      return res.status(400).json({ error: "Invalid status" });
    }

    const appQuery = await pool.query(
      "SELECT * FROM driver_applications WHERE application_id = $1",
      [id],
    );

    const application = appQuery.rows[0];

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (status === "approved") {
      const { email, phone, car_model, license_number } = application;

      const userCheck = await pool.query(
        "SELECT user_id FROM users WHERE email = $1",
        [email],
      );

      if (userCheck.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "No account found with this email" });
      }

      const userId = userCheck.rows[0].user_id;

      await pool.query(
        "UPDATE users SET role = 'driver', phone_number = $2 WHERE user_id = $1",
        [userId, phone],
      );

      await pool.query(
        `INSERT INTO driver_profiles (user_id, car_model, license_number, is_available)
        VALUES ($1, $2, $3, true)
        ON CONFLICT (user_id) DO UPDATE
        SET car_model = EXCLUDED.car_model, license_number = EXCLUDED.license_number`,
        [userId, car_model, license_number],
      );
    }

    await pool.query(
      "UPDATE driver_applications SET status = $1 WHERE application_id = $2",
      [status, id],
    );

    res.json({ message: `Application ${status}` });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/drivers-list", authorize, admin, async (req, res) => {
  try {
    const drivers = await pool.query(
      `SELECT
        u.user_id,
        u.full_name,
        u.email,
        u.phone_number,
        u.created_at,
        dp.car_model,
        dp.license_number,
        dp.is_available,
        COUNT(b.booking_id) AS total_trips
      FROM users u
      LEFT JOIN driver_profiles dp ON u.user_id = dp.user_id
      LEFT JOIN bookings b ON u.user_id = b.driver_id AND b.status = 'completed'
      WHERE u.role = 'driver'
      GROUP BY
        u.user_id,
        dp.car_model,
        dp.license_number,
        dp.is_available
      ORDER BY total_trips DESC`,
    );

    res.json(drivers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

router.put("/assign-driver", authorize, admin, async (req, res) => {
  try {
    const { booking_id, driver_id } = req.body;

    const driverQuery = await pool.query(
      `SELECT u.full_name, u.phone_number, dp.car_model, dp.license_number
       FROM users u LEFT JOIN driver_profiles dp ON u.user_id = dp.user_id
       WHERE u.user_id = $1 AND u.role = 'driver'`,
      [driver_id],
    );
    const driver = driverQuery.rows[0];

    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    const endRidePin = Math.floor(1000 + Math.random() * 9000).toString();

    const updatedBooking = await pool.query(
      "UPDATE bookings SET status = 'confirmed', driver_id = $1, end_ride_pin = $2 WHERE booking_id = $3 AND status = 'pending' RETURNING *",
      [driver_id, endRidePin, booking_id],
    );

    const booking = updatedBooking.rows[0];

    if (!booking) {
      return res
        .status(404)
        .json({ error: "Booking not found or already assigned" });
    }

    const messageBody = `
✅ *Driver Assigned!*

👤 *Driver:* ${driver.full_name}
🚗 *Vehicle:* ${driver.car_model || "Not specified"}
📋 *Plate:* ${driver.license_number || "Not specified"}
📞 *Contact:* +91${driver.phone_number}

🔒 *SECURITY PIN:* ${endRidePin}
(Please give this 4-digit PIN to your driver ONLY when you have reached your destination to complete the ride.)
    `;

    try {
      await client.messages.create({
        body: messageBody,
        from: "whatsapp:" + process.env.TWILIO_PHONE_NUMBER,
        to: `whatsapp:+${booking.phone}`,
      });
    } catch (twilioErr) {
      console.error("Twilio WhatsApp Error:", twilioErr.message);
    }

    res.json({ message: "Driver assigned and user notified!" });
  } catch (err) {
    console.error("Assignment Error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
