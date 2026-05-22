const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Gallery = require('../models/Gallery');
const authMiddleware = require('../middleware/authMiddleware');
const fs = require('fs');

// Use BACKEND_URL env var in production to build correct absolute URLs for uploaded files
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

const deleteFileFromDisk = (url) => {
  if (!url || typeof url !== 'string') return;
  try {
    const fileName = url.split('/').pop();
    const filePath = path.join(__dirname, '../uploads', fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error('Failed to delete file:', url, err.message);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max overall
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  }
});

// GET /api/gallery
router.get('/', async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('Error fetching gallery:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// POST /api/gallery
router.post('/', authMiddleware, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  const { caption, description, link } = req.body;
  if (!req.files || (!req.files.image && !req.files.video)) {
    return res.status(400).json({ message: 'At least one media file (image or video) is required' });
  }

  const maxImageSize = 5 * 1024 * 1024; // 5MB
  if (req.files.image && req.files.image[0].size > maxImageSize) {
    return res.status(400).json({ message: 'Image size exceeds the 5MB limit.' });
  }

  let imageUrl = '';
  let videoUrl = '';

  if (req.files.image) {
    imageUrl = `${BACKEND_URL}/uploads/${req.files.image[0].filename}`;
  }
  if (req.files.video) {
    videoUrl = `${BACKEND_URL}/uploads/${req.files.video[0].filename}`;
  }

  try {
    const newItem = new Gallery({ image: imageUrl, video: videoUrl, caption, description, link });
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE /api/gallery/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    // Delete associated files from disk
    if (item.image) deleteFileFromDisk(item.image);
    if (item.video) deleteFileFromDisk(item.video);

    await item.deleteOne();
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
