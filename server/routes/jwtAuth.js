const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwtGenerator = require("../utils/jwtGenerator");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json({ error: "User already exists" });
    }

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO users (full_name, email, password_hash, role) VALUES ($1, $2, $3, 'customer') RETURNING *",
      [name, email, bcryptPassword],
    );

    const token = jwtGenerator(newUser.rows[0].user_id, newUser.rows[0].role);

    res.json({
      token,
      user: {
        name: newUser.rows[0].full_name,
        email: newUser.rows[0].email,
        role: newUser.rows[0].role,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Password or Email is incorrect" });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password_hash,
    );

    if (!validPassword) {
      return res.status(401).json({ error: "Password or Email is incorrect" });
    }

    const token = jwtGenerator(user.rows[0].user_id, user.rows[0].role);

    res.json({
      token,
      user: {
        name: user.rows[0].full_name,
        email: user.rows[0].email,
        role: user.rows[0].role,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
