const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// POST /api/services
router.post('/', authMiddleware, async (req, res) => {
  const { name, description, icon, color } = req.body;
  try {
    const newService = new Service({ name, description, icon, color });
    await newService.save();
    res.json(newService);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT /api/services/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE /api/services/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    await service.deleteOne();
    res.json({ message: 'Service removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
