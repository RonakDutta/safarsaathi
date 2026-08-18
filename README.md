# 🚖 SafarSaathi — Hourly Driver & Cab Booking Platform

**SafarSaathi** is a full-stack, production-grade hourly driver-on-demand and cab booking web application built for the Indian market. It enables customers to hire professional drivers for hourly durations (1–24 hours), processes online payments securely via Razorpay (with HMAC-SHA256 signature verification) or Cash, dispatches real-time WhatsApp & Email receipts via Twilio and Nodemailer, and provides dedicated Role-Based dashboards for **Admins** and **Drivers** with a 4-digit security PIN ride-completion mechanism.

---

## 📑 Table of Contents
1. [Tech Stack & Architecture](#-tech-stack--architecture)
2. [Environment Variables Setup](#-environment-variables-setup)
3. [Database Schemas & Neon DB SQL Commands](#-database-schemas--neon-db-sql-commands)
4. [Authentication & RBAC Middleware](#-authentication--rbac-middleware)
5. [Axios Token Header Interceptor](#-axios-token-header-interceptor)
6. [Razorpay Integration & Fraud Verification](#-razorpay-integration--fraud-verification)
7. [Automated Notifications (Twilio & Nodemailer)](#-automated-notifications-twilio--nodemailer)
8. [Workflows & Security PIN System](#-workflows--security-pin-system)
9. [Complete API Endpoints Reference](#-complete-api-endpoints-reference)
10. [Local Development Setup](#-local-development-setup)

---

## 🛠️ Tech Stack & Architecture

### **Frontend (`client/`)**
* **Framework:** React 18, Vite
* **Routing & State:** React Router DOM v6, React Context API (`AuthContext`)
* **HTTP Client:** Axios (Custom Instance with Request Interceptors)
* **Styling & Notifications:** Tailwind CSS, FontAwesome Icons, `react-hot-toast`
* **Geolocation:** HTML5 Geolocation API + OpenStreetMap Nominatim Reverse Geocoding API

### **Backend (`server/`)**
* **Runtime & Framework:** Node.js, Express.js (v5)
* **Database Driver:** `pg` (PostgreSQL Client Pool connected to **Neon DB**)
* **Authentication:** JSON Web Tokens (`jsonwebtoken`), Password Hashing (`bcryptjs`)
* **Payment Processing:** Razorpay Node SDK (`razorpay`) + Node Native `crypto` (HMAC-SHA256)
* **Messaging & Mail:** Twilio Node SDK (`twilio` for WhatsApp) + Nodemailer (`nodemailer` for SMTP Email)

---

## 🔑 Environment Variables Setup

Create a `.env` file inside the `server/` folder:

```env
PORT=5000
DATABASE_URL=postgres://<user>:<password>@<neon-hostname>/<dbname>?sslmode=require
JWT_SECRET=your_jwt_super_secret_key

# Razorpay Keys
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx

# Twilio Keys (WhatsApp)
TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+14155238886

# Nodemailer Credentials (Gmail SMTP)
EMAIL_USER=safarsaathi.cab@gmail.com
EMAIL_PASS=your_gmail_app_password
```

---

## 🗄️ Database Schemas & Neon DB SQL Commands

PostgreSQL hosted on **Neon Serverless Postgres**.

### **1. DDL Statements (Run in Neon DB SQL Editor to Create Tables)**

```sql
-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'customer', -- 'customer', 'driver', 'admin'
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. DRIVER PROFILES TABLE
CREATE TABLE IF NOT EXISTS driver_profiles (
    user_id INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    car_model VARCHAR(255),
    license_number VARCHAR(100),
    is_available BOOLEAN DEFAULT TRUE
);

-- 3. DRIVER APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS driver_applications (
    application_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    car_model VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
    booking_id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    pickup_location TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'Online' or 'Cash'
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    amount NUMERIC(10, 2) NOT NULL, -- duration * 200 INR
    payment_status VARCHAR(50) DEFAULT 'unpaid', -- 'unpaid', 'paid'
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'completed'
    driver_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    end_ride_pin VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **2. Neon DB Useful Inspection Queries**

```sql
-- View all tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- View table column specifications
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name IN ('users', 'driver_profiles', 'driver_applications', 'bookings')
ORDER BY table_name, ordinal_position;

-- Drivers with total trip counts (Used in Admin Dashboard)
SELECT 
    u.user_id, u.full_name, u.email, u.phone_number, dp.car_model, dp.license_number,
    COALESCE(COUNT(b.booking_id), 0) AS total_trips
FROM users u
LEFT JOIN driver_profiles dp ON u.user_id = dp.user_id
LEFT JOIN bookings b ON u.user_id = b.driver_id AND b.status = 'completed'
WHERE u.role = 'driver'
GROUP BY u.user_id, dp.car_model, dp.license_number
ORDER BY total_trips DESC;
```

---

## 🔐 Authentication & RBAC Middleware

### **JWT Generator Utility (`server/utils/jwtGenerator.js`)**
```javascript
const jwt = require("jsonwebtoken");

function jwtGenerator(user_id, role) {
  const payload = { user: { id: user_id, role: role } };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

module.exports = jwtGenerator;
```

### **1. Base Auth Middleware (`server/middleware/authorization.js`)**
```javascript
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.header("token");
    if (!jwtToken) return res.status(403).json("Not Authorized");

    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.user = payload.user; // { id, role }
    next();
  } catch (err) {
    return res.status(403).json("Not Authorized");
  }
};
```

### **2. Admin Role Guard (`server/middleware/admin.js`)**
```javascript
module.exports = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access Denied: Admins Only" });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
```

### **3. Driver Role Guard (`server/middleware/driver.js`)**
```javascript
module.exports = async (req, res, next) => {
  try {
    if (req.user.role !== "driver") {
      return res.status(403).json({ error: "Access Denied: Drivers Only" });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
```

---

## ⚡ Axios Token Header Interceptor

`client/src/api/axios.js` creates an Axios instance that intercepts all outgoing requests and automatically attaches the `token` header from `localStorage`:

```javascript
import axios from "axios";

const instance = axios.create({
  baseURL: "https://safarsaathi-irhg.onrender.com",
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
```

---

## 💳 Razorpay Integration & Fraud Verification

### **1. Server Order Creation (`POST /api/book-ride`)**
```javascript
const amount = duration * 200; // Base fare ₹200/hr

if (paymentMethod === "Online") {
  const options = {
    amount: amount * 100, // Converts INR to Paise
    currency: "INR",
    receipt: bookingId.toString().substring(0, 40),
  };

  const order = await razorpay.orders.create(options);

  await pool.query("UPDATE bookings SET razorpay_order_id = $1 WHERE booking_id = $2", [
    order.id,
    bookingId,
  ]);

  return res.json({ requiresPayment: true, order, bookingId, key: process.env.RAZORPAY_KEY_ID });
}
```

### **2. Frontend Popup Trigger & Modal Dismissal Cleanup (`client/src/components/Body.jsx`)**
```javascript
const options = {
  key: res.data.key,
  amount: res.data.order.amount,
  currency: "INR",
  name: "SafarSaathi",
  order_id: res.data.order.id,
  handler: async function (response) {
    // Verified on server after completion
    await axios.post("/api/book-ride/verify-payment", {
      ...response,
      bookingId: res.data.bookingId,
    });
  },
  modal: {
    ondismiss: async function () {
      // Deletes unpaid booking row if popup closed without paying
      await axios.post("/api/book-ride/cancel-booking", { bookingId: res.data.bookingId });
    },
  },
};
const paymentObject = new window.Razorpay(options);
paymentObject.open();
```

### **3. Cryptographic HMAC-SHA256 Signature Verification (`POST /api/book-ride/verify-payment`)**
```javascript
const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

// Recompute SHA-256 HMAC digest
const body = razorpay_order_id + "|" + razorpay_payment_id;
const expectedSignature = crypto
  .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
  .update(body.toString())
  .digest("hex");

if (expectedSignature === razorpay_signature) {
  await pool.query(
    "UPDATE bookings SET payment_status = 'paid', razorpay_payment_id = $1 WHERE booking_id = $2",
    [razorpay_payment_id, bookingId]
  );
  res.json({ success: true, message: "Payment verified successfully" });
} else {
  res.status(400).json({ success: false, message: "Invalid digital signature" });
}
```

---

## 📲 Automated Notifications (Twilio & Nodemailer)

Whenever a ride is booked or driver is assigned, the backend dispatches notifications via Twilio (WhatsApp) and Nodemailer (SMTP Email):

```javascript
const twilio = require("twilio");
const nodemailer = require("nodemailer");

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4, // Forces IPv4 resolution for Gmail SMTP
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const sendBookingMessage = async (name, pickup, duration, paymentMethod, phone, email) => {
  const messageBody = `
🚖 *New Booking Confirmed!*
👤 *Name:* ${name}
📍 *Pickup:* ${pickup}
⏳ *Duration:* ${duration} Hours
💳 *Payment:* ${paymentMethod}
📞 *Phone:* +${phone}
✉️ *Email:* ${email}`;

  // Twilio WhatsApp Message
  await client.messages.create({
    body: messageBody,
    from: "whatsapp:" + process.env.TWILIO_PHONE_NUMBER,
    to: `whatsapp:+${phone}`,
  });

  // Nodemailer SMTP Email
  transporter.sendMail({
    from: '"SafarSaathi Admin" <safarsaathi.cab@gmail.com>',
    to: email,
    subject: "Your SafarSaathi Ride is Confirmed! 🚖",
    text: messageBody,
  });
};
```

---

## 🔒 Workflows & 4-Digit Security PIN System

```
[Customer Books Ride] ──► [Admin Views Panel] ──► [Admin Selects Driver]
                                                            │
                                                            ▼
                                           Generates 4-Digit PIN (e.g. 4829)
                                                            │
                                                            ▼
                                           Sends WhatsApp/Email to Customer
                                                            │
                                                            ▼
                                           Driver Reaches Destination & Asks Customer
                                                            │
                                                            ▼
                                           Driver Inputs PIN on Driver Dashboard
                                                            │
                                                            ▼
                                           Server Compares PIN -> Status = 'completed'
```

1. **Driver Onboarding:** User submits form at `/drive`. Admin reviews application at `/admin`. Upon approval, backend upgrades user to `role = 'driver'` and seeds default password `"driver123"` if account is new.
2. **Driver Assignment:** Admin picks driver for booking (`PUT /api/admin/assign-driver`). Backend creates random 4-digit PIN (`Math.floor(1000 + Math.random() * 9000)`), stores it in `bookings.end_ride_pin`, and sends it to customer's WhatsApp & Email.
3. **Ride Completion:** Driver opens `/driver` board. At trip end, driver prompts customer for PIN and submits it (`PUT /api/driver-board/complete/:id`). Backend checks PIN match. If match, trip status updates to `'completed'`.
4. **Admin Live Polling:** Admin dashboard polls server every 20 seconds. Shows toast notification `"A driver just completed a ride! 🚖✅"` when new completed trip is detected.

---

## 📌 Complete API Endpoints Reference

| Method | Route Endpoint | Guard / Middleware | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Register customer/driver account |
| `POST` | `/auth/login` | Public | Login and receive JWT token |
| `POST` | `/api/book-ride/` | Public | Create ride booking & Razorpay order |
| `POST` | `/api/book-ride/verify-payment` | Public | Verify Razorpay HMAC-SHA256 signature |
| `POST` | `/api/book-ride/cancel-booking` | Public | Delete unpaid abandoned booking |
| `POST` | `/api/driver-apply/` | Public | Submit driver application |
| `GET` | `/api/driver-apply/my-application-status` | `authorization` | Check application status |
| `GET` | `/api/admin/stats` | `authorization` + `admin` | Fetch dashboard counts & revenue |
| `GET` | `/api/admin/bookings` | `authorization` + `admin` | Fetch all trip bookings |
| `DELETE`| `/api/admin/bookings/:id` | `authorization` + `admin` | Delete booking record |
| `GET` | `/api/admin/applications` | `authorization` + `admin` | Fetch driver applications |
| `PUT` | `/api/admin/applications/:id` | `authorization` + `admin` | Approve/Reject driver application |
| `GET` | `/api/admin/drivers` | `authorization` + `admin` | Fetch active drivers list |
| `GET` | `/api/admin/drivers-list` | `authorization` + `admin` | Fetch detailed drivers with trip count |
| `PUT` | `/api/admin/assign-driver` | `authorization` + `admin` | Assign driver & dispatch 4-digit PIN |
| `GET` | `/api/driver-board/my-trips` | `authorization` + `driver` | Fetch trips assigned to logged-in driver |
| `PUT` | `/api/driver-board/complete/:id` | `authorization` | Verify 4-digit PIN & complete trip |
| `PUT` | `/api/driver-board/cancel/:id` | `authorization` + `driver` | Cancel trip and return to queue |

---

## 🚀 Local Development Setup

### **1. Backend Setup**
```bash
cd server
npm install
npm run dev
# Running on http://localhost:5000
```

### **2. Frontend Setup**
```bash
cd client
npm install
npm run dev
# Running on http://localhost:5173
```
