const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

app.use(express.json());
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://safarsaathi-frontend.vercel.app",
  "https://safarsaathi.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "SafarSaathi API is running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.use("/auth", require("./routes/jwtAuth"));
app.use("/api/book-ride", require("./routes/booking"));
app.use("/api/driver", require("./routes/driver"));
app.use("/api/driver-apply", require("./routes/driver"));
app.use("/api/admin", require("./routes/adminDashboard"));
app.use("/api/driver-board", require("./routes/driverDashboard"));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
