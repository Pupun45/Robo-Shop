const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  images: [{ type: String }],
  videos: [{ type: String }],
  discount: { type: Number, default: 0 },
  hostingLink: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
