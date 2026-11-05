export const HOURLY_RATE = 200;

export const formatINR = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;
