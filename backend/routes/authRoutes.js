const express = require('express');
const router = express.Router();

// In-memory user store (replace with DB in production)
const users = [];

// Signup
router.post('/signup', (req, res) => {
  const { username, password, userClass } = req.body;
  if (!username || !password || !userClass) {
    return res.status(400).json({ error: 'All fields required' });
  }
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error: 'User exists' });
  }
  users.push({ username, password, userClass });
  res.json({ message: 'Signup successful' });
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ message: 'Login successful', userClass: user.userClass });
});

module.exports = router;