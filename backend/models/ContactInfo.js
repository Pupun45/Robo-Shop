const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  ourLocation: { type: String, default: '123 Robo Way, Robot City, CA 90210' },
  salesLine: { type: String, default: '+1 (555) 123-4567' },
  generalInquiry: { type: String, default: 'info@roboshop.com' },
  supportCenter: { type: String, default: 'support@roboshop.com' },
}, { timestamps: true });

module.exports = mongoose.model('ContactInfo', contactInfoSchema);
