const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plainPassword: { type: String, default: 'adminpassword123' }
});

module.exports = mongoose.model('Admin', adminSchema);

