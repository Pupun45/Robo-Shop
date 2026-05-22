const express = require('express');
const router = express.Router();
const FooterSettings = require('../models/FooterSettings');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/footer - Fetch footer settings (Public)
router.get('/', async (req, res) => {
  try {
    let settings = await FooterSettings.findOne();
    if (!settings) {
      settings = new FooterSettings();
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    console.error('Error fetching footer settings:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// PUT /api/footer - Update footer settings (Admin only)
router.put('/', authMiddleware, async (req, res) => {
  const { brandDescription, products, services, copyrightText } = req.body;
  try {
    let settings = await FooterSettings.findOne();
    if (!settings) {
      settings = new FooterSettings();
    }
    
    if (brandDescription !== undefined) settings.brandDescription = brandDescription;
    if (products !== undefined) settings.products = products;
    if (services !== undefined) settings.services = services;
    if (copyrightText !== undefined) settings.copyrightText = copyrightText;

    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error('Error updating footer settings:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = router;
