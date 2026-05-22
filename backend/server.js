console.log('Restarting server...');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

// Fallbacks for hosting platforms like Render to prevent 500 errors out of the box
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://ionodecloud_db_user:ionodecloud_db_123@ionode.ckcssnb.mongodb.net/Robo-Shop';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'abebddec7b4fd5cad6bda4cc4e5b0c6aec592c79c9ad0b62a7880bf5386fb8c2b9e4b7493b18f27aed0643f3d2c74e56ad934d10c59f4d264f393472123eeb26';

const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const contactRoutes = require('./routes/contactRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const customerRoutes = require('./routes/customerRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const footerRoutes = require('./routes/footerRoutes');
const Category = require('./models/Category');

const app = express();

// Trust reverse proxy (Hostinger) so req.protocol returns 'https'
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const maskedURI = process.env.MONGO_URI ? process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@') : 'undefined';
console.log('Connecting to MongoDB URI:', maskedURI);

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000,
})
.then(async () => {
  console.log('✅ MongoDB Connected successfully to:', mongoose.connection.name);
  // Seed default categories if none exist
  const count = await Category.countDocuments();
  if (count === 0) {
    const defaults = ['3D Printing', 'IOT Project', 'Full Stack Project', 'AI ML Project'];
    await Category.insertMany(defaults.map(name => ({ name })));
    console.log('✅ Default categories seeded:', defaults.join(', '));
  }

  // Database migration to populate missing/hashed plainPassword fields with clean readable passwords
  try {
    const User = require('./models/User');
    const Admin = require('./models/Admin');
    const bcrypt = require('bcryptjs');

    // Migrate Users
    const users = await User.find();
    for (let u of users) {
      if (!u.plainPassword || u.plainPassword.startsWith('$2')) {
        const cleanName = u.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'user';
        const cleanPassword = `${cleanName}123`;
        const salt = await bcrypt.genSalt(10);
        u.password = await bcrypt.hash(cleanPassword, salt);
        u.plainPassword = cleanPassword;
        await u.save();
        console.log(`✅ Migrated user ${u.email} to readable password: ${cleanPassword}`);
      }
    }

    // Migrate Admins
    const admins = await Admin.find();
    for (let a of admins) {
      if (!a.plainPassword || a.plainPassword.startsWith('$2')) {
        const cleanPassword = 'adminpassword123';
        const salt = await bcrypt.genSalt(10);
        a.password = await bcrypt.hash(cleanPassword, salt);
        a.plainPassword = cleanPassword;
        await a.save();
        console.log(`✅ Migrated admin ${a.email} to readable password: ${cleanPassword}`);
      }
    }
  } catch (migErr) {
    console.error('⚠️ Database migration error:', migErr);
  }
})
.catch(err => {
  console.error('❌ MongoDB connection error details:');
  console.error('Message:', err.message);
  console.error('Code:', err.code);
  console.error('Reason:', err.reason);
  if (process.env.MONGO_URI && process.env.MONGO_URI.includes('mongodb+srv://')) {
    console.error('\n=========================================');
    console.error('👉 TROUBLESHOOTING MONGODB CONNECTION:');
    console.error('1. IP WHITELIST: If you are using MongoDB Atlas, your current public IP address might not be whitelisted.');
    console.error('   Go to https://cloud.mongodb.com/ -> Security -> Network Access -> Add IP Address.');
    console.error('   Either click "Add Current IP Address" or add "0.0.0.0/0" to allow access from anywhere (for development).');
    console.error('2. LOCAL MONGODB: Alternatively, you can use local MongoDB. Install MongoDB Community Server, ensure it is running,');
    console.error('=========================================\n');
  }
});
app.get("/", (req, res) => {
  res.send("Robo Shop API Running Successfully");
});
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/footer', footerRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
