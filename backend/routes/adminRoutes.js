const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/setup', async (req, res) => {
  const { email, password } = req.body;
  try {
    let admin = await Admin.findOne({ email });
    if (admin) return res.status(400).json({ message: 'Admin already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    admin = new Admin({ email, password: hashedPassword, plainPassword: password });
    await admin.save();

    res.json({ message: 'Admin created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get current logged-in admin email
router.get('/credentials', authMiddleware, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update current admin email and password
router.put('/credentials', authMiddleware, async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findById(req.admin);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    if (email) admin.email = email.trim();
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password.trim(), salt);
      admin.plainPassword = password.trim();
    }

    await admin.save();
    res.json({ message: 'Admin credentials updated successfully', email: admin.email, plainPassword: admin.plainPassword });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

