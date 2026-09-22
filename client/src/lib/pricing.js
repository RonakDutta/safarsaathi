// Mirrors the server's fare calculation in routes/booking.js (duration * 200)
export const HOURLY_RATE = 200;

export const formatINR = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;
