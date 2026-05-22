const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  image: { type: String, default: '' },
  video: { type: String, default: '' },
  caption: { type: String, required: true },
  description: { type: String, default: '' },
  link: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
