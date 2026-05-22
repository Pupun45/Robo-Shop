const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'HardDrive' },
  color: { type: String, default: 'text-indigo-500' },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
