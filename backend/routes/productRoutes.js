const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
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

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

router.post('/', authMiddleware, upload.fields([{ name: 'image', maxCount: 10 }, { name: 'video', maxCount: 2 }]), async (req, res) => {
  const { title, description, price, category, discount, hostingLink } = req.body;
  
  let imageUrls = [];
  let videoUrls = [];

  if (req.files && req.files.image) {
    imageUrls = req.files.image.map(file => `${BACKEND_URL}/uploads/${file.filename}`);
  }
  if (req.files && req.files.video) {
    videoUrls = req.files.video.map(file => `${BACKEND_URL}/uploads/${file.filename}`);
  }

  try {
    const newProduct = new Product({
      title,
      description,
      price,
      category,
      discount: discount || 0,
      hostingLink: hostingLink || '',
      images: imageUrls,
      videos: videoUrls
    });
    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', authMiddleware, upload.fields([{ name: 'image', maxCount: 10 }, { name: 'video', maxCount: 2 }]), async (req, res) => {
  const { title, description, price, category, discount, hostingLink } = req.body;

  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.discount = discount !== undefined ? discount : product.discount;
    product.hostingLink = hostingLink !== undefined ? hostingLink : product.hostingLink;

    let currentImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : product.images;
    let currentVideos = req.body.existingVideos ? JSON.parse(req.body.existingVideos) : product.videos;

    // Identify and delete files removed from the arrays
    product.images.forEach(img => {
      if (!currentImages.includes(img)) deleteFileFromDisk(img);
    });
    product.videos.forEach(vid => {
      if (!currentVideos.includes(vid)) deleteFileFromDisk(vid);
    });

    if (req.files && req.files.image) {
      const newImages = req.files.image.map(file => `${BACKEND_URL}/uploads/${file.filename}`);
      currentImages = [...currentImages, ...newImages].slice(0, 10);
    }
    if (req.files && req.files.video) {
      const newVideos = req.files.video.map(file => `${BACKEND_URL}/uploads/${file.filename}`);
      currentVideos = [...currentVideos, ...newVideos].slice(0, 2);
    }

    product.images = currentImages;
    product.videos = currentVideos;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Delete all associated files from disk
    product.images.forEach(img => deleteFileFromDisk(img));
    product.videos.forEach(vid => deleteFileFromDisk(vid));

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
