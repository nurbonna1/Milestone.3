const express = require('express');
const router = express.Router();
const pool = require('../database');

// middleware: check admin
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.Administrator) next();
  else res.status(403).json({ message: 'Access denied' });
}

router.get('/users', isAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT Username, Administrator, Address FROM Users");
    res.json({ users: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error' });
  }
});

module.exports = router;
