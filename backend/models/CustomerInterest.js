const mongoose = require('mongoose');

const customerInterestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  productName: { type: String, required: true },
  productId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('CustomerInterest', customerInterestSchema);
