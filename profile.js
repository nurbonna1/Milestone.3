const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../database'); // assuming you're using MySQL pool

// middleware to check if logged in
function isAuthenticated(req, res, next) {
  if (req.session.user) next();
  else res.status(401).json({ message: 'Not logged in' });
}

router.post('/update', isAuthenticated, async (req, res) => {
  const { password, address, profile_picture } = req.body;
  const username = req.session.user.username;

  try {
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      await pool.query("UPDATE Users SET Password = ? WHERE Username = ?", [hashed, username]);
    }

    await pool.query("UPDATE Users SET Address = ?, Profile_Picture = ? WHERE Username = ?", [address, profile_picture, username]);
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
