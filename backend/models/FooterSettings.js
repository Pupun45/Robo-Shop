const mongoose = require('mongoose');

const footerSettingsSchema = new mongoose.Schema({
  brandDescription: { 
    type: String, 
    default: 'Leading the way in robotics, retail, and custom engineering solutions.' 
  },
  products: { 
    type: [String], 
    default: ['Robotics Gear', '3D Printing', 'IoT Devices', 'Embedded Systems'] 
  },
  services: { 
    type: [String], 
    default: ['Robotics Consulting', 'Dev Consulting', 'Prototyping', 'Customer Support'] 
  },
  copyrightText: { 
    type: String, 
    default: 'Robo Shop. All rights reserved.' 
  }
}, { timestamps: true });

module.exports = mongoose.model('FooterSettings', footerSettingsSchema);
