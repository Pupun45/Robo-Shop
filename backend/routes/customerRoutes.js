const express = require('express');
const router = express.Router();
const CustomerInterest = require('../models/CustomerInterest');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/customers - Submit a new customer interest
router.post('/', async (req, res) => {
  const { name, mobile, address, productName, productId } = req.body;
  if (!name || !mobile || !address || !productName) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const entry = new CustomerInterest({ name, mobile, address, productName, productId });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    console.error('Error saving customer interest:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/customers - Admin: Get all customer interest submissions
router.get('/', authMiddleware, async (req, res) => {
  try {
    const customers = await CustomerInterest.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// DELETE /api/customers/:id - Admin: Delete a customer interest entry
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const entry = await CustomerInterest.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    await entry.deleteOne();
    res.json({ message: 'Customer entry deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
