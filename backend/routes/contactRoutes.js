const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const authMiddleware = require('../middleware/authMiddleware');

const ContactInfo = require('../models/ContactInfo');

router.post('/', async (req, res) => {
  const { name, email, phone, message } = req.body;
  try {
    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();
    res.json(newContact);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// GET /api/contact/info - Fetch contact details (Public)
router.get('/info', async (req, res) => {
  try {
    let info = await ContactInfo.findOne();
    if (!info) {
      info = new ContactInfo();
      await info.save();
    }
    res.json(info);
  } catch (err) {
    console.error('Error fetching contact info:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// PUT /api/contact/info - Update contact details (Admin only)
router.put('/info', authMiddleware, async (req, res) => {
  const { ourLocation, salesLine, generalInquiry, supportCenter } = req.body;
  try {
    let info = await ContactInfo.findOne();
    if (!info) {
      info = new ContactInfo();
    }
    if (ourLocation !== undefined) info.ourLocation = ourLocation;
    if (salesLine !== undefined) info.salesLine = salesLine;
    if (generalInquiry !== undefined) info.generalInquiry = generalInquiry;
    if (supportCenter !== undefined) info.supportCenter = supportCenter;
    
    await info.save();
    res.json(info);
  } catch (err) {
    console.error('Error updating contact info:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// DELETE /api/contact/:id - Delete a contact submission (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Submission not found' });
    await contact.deleteOne();
    res.json({ message: 'Submission deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = router;
