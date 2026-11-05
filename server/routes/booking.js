const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const router = require("express").Router();
const pool = require("../db");
const twilio = require("twilio");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const authorize = require("../middleware/authorization");

const twilioSid = process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_SID;
const client = twilio(twilioSid, process.env.TWILIO_AUTH_TOKEN);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const HOURLY_RATE = 200;

const sendBookingMessage = async (booking) => {
  const messageBody = `
🚖 *New Booking Confirmed!*

👤 *Name:* ${booking.user_name}
📍 *Pickup:* ${booking.pickup_location}
⏳ *Duration:* ${booking.duration} Hours
💳 *Payment:* ${booking.payment_method}
📞 *Phone:* +${booking.phone}

A driver will be assigned to you shortly

Ref: #${booking.booking_id}`;

  try {
    await client.messages.create({
      body: messageBody,
      from: "whatsapp:" + process.env.TWILIO_PHONE_NUMBER,
      to: `whatsapp:+${booking.phone}`,
    });
  } catch (twilioErr) {
    console.error("Twilio WhatsApp Error:", twilioErr.message);
  }
};

router.post("/", authorize, async (req, res) => {
  try {
    const { name, pickup, phone, email, paymentMethod, coordinates } =
      req.body;
    const duration = Number(req.body.duration);

    if (!name || !pickup || !phone || !email) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    if (!Number.isInteger(duration) || duration < 1 || duration > 24) {
      return res
        .status(400)
        .json({ error: "Duration must be between 1 and 24 hours" });
    }

    if (paymentMethod !== "Online" && paymentMethod !== "Cash") {
      return res.status(400).json({ error: "Invalid payment method" });
    }

    const amount = duration * HOURLY_RATE;

    const newBooking = await pool.query(
      "INSERT INTO bookings (user_name, pickup_location, phone, email, duration, payment_method, latitude, longitude, amount, payment_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'unpaid') RETURNING *",
      [
        name,
        pickup,
        phone,
        email,
        duration,
        paymentMethod,
        coordinates?.lat ?? null,
        coordinates?.lon ?? null,
        amount,
      ],
    );

    const booking = newBooking.rows[0];

    if (paymentMethod === "Online") {
      try {
        const options = {
          amount: amount * 100,
          currency: "INR",
          receipt: booking.booking_id.toString().substring(0, 40),
        };

        const order = await razorpay.orders.create(options);

        await pool.query(
          "UPDATE bookings SET razorpay_order_id = $1 WHERE booking_id = $2",
          [order.id, booking.booking_id],
        );

        return res.json({
          requiresPayment: true,
          order,
          bookingId: booking.booking_id,
          key: process.env.RAZORPAY_KEY_ID,
        });
      } catch (razorpayErr) {
        console.error("Razorpay Order Creation Error:", razorpayErr);
        await pool.query("DELETE FROM bookings WHERE booking_id = $1", [booking.booking_id]);
        return res.status(502).json({
          error: "Payment gateway error. Please verify Razorpay credentials or choose Cash payment.",
          details: razorpayErr.error?.description || razorpayErr.message,
        });
      }
    }

    await sendBookingMessage(booking);

    res.json({
      requiresPayment: false,
      success: true,
      message: "Booking saved and message sent!",
      bookingId: booking.booking_id,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

router.post("/verify-payment", authorize, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid digital signature" });
    }

    const updatedBooking = await pool.query(
      "UPDATE bookings SET payment_status = 'paid', razorpay_payment_id = $1 WHERE booking_id = $2 AND razorpay_order_id = $3 RETURNING *",
      [razorpay_payment_id, bookingId, razorpay_order_id],
    );

    if (updatedBooking.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Booking not found" });
    }

    await sendBookingMessage(updatedBooking.rows[0]);

    res.json({ success: true, message: "Payment verified successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

router.post("/cancel-booking", authorize, async (req, res) => {
  try {
    const { bookingId } = req.body;

    await pool.query(
      "DELETE FROM bookings WHERE booking_id = $1 AND payment_method = 'Online' AND payment_status = 'unpaid'",
      [bookingId],
    );

    res.json({ success: true, message: "Abandoned booking cleared." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
