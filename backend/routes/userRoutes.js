const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const authMiddleware = require('../middleware/authMiddleware');

// User Registration: Name, Mobile, Email, Password
router.post('/signup', async (req, res) => {
  const { name, mobile, email, password } = req.body;
  if (!name || !mobile || !email || !password) {
    return res.status(400).json({ message: 'All fields (name, mobile number, email, password) are required.' });
  }

  try {
    let existingUser = await User.findOne({
      $or: [
        { mobile: mobile.trim() },
        { email: email.trim().toLowerCase() }
      ]
    });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this mobile number or email already exists.' });
    }

    // Also check if admin exists with this email
    const existingAdmin = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Email address already in use.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      plainPassword: password
    });

    await user.save();

    const token = jwt.sign({ id: user._id, name: user.name, mobile: user.mobile, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, mobile: user.mobile, email: user.email } });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Single Unified Login: Email and Password
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // 1. Check if email belongs to the Admin
    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (isMatch) {
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, isAdmin: true });
      }
    }

    // 2. Check if email belongs to a Customer/User
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id, name: user.name, mobile: user.mobile, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, isAdmin: false, user: { id: user._id, name: user.name, mobile: user.mobile, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Admin Route: Get all registered users
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Admin Route: Update user details
router.put('/:id', authMiddleware, async (req, res) => {
  const { name, mobile, email, password } = req.body;
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (name) user.name = name.trim();
    if (mobile) {
      const existingUser = await User.findOne({ mobile: mobile.trim(), _id: { $ne: req.params.id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Mobile number already in use by another account.' });
      }
      user.mobile = mobile.trim();
    }
    if (email) {
      const existingUser = await User.findOne({ email: email.trim().toLowerCase(), _id: { $ne: req.params.id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email address already in use by another account.' });
      }
      user.email = email.trim().toLowerCase();
    }
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.plainPassword = password;
    }

    await user.save();
    res.json({ message: 'User updated successfully.', user });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Admin Route: Delete user
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await user.deleteOne();
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = router;
