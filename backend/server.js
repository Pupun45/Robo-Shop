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
process.env.JWT_SECRET = process.env.JWT_SECRET || 'b57e4cda049dd34550c2971f6b4dbb57f9146d7dbf10a7f416ab25833e5f96cb9b24891573118f05f19bb95a60e49de64c9db5b22c02ee7d9870afb613c9c33c';

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

  // Migrate Products and Gallery images/videos to relative paths
  try {
    const Product = require('./models/Product');
    const Gallery = require('./models/Gallery');

    const cleanToRelative = (filePath) => {
      if (!filePath || typeof filePath !== 'string') return filePath;
      if (filePath.includes('/uploads/')) {
        const parts = filePath.split('/uploads/');
        const filename = parts[parts.length - 1];
        return `/uploads/${filename}`;
      }
      return filePath;
    };

    // Migrate Products
    const products = await Product.find();
    let productMigrationCount = 0;
    for (let p of products) {
      let changed = false;
      if (p.images && p.images.length > 0) {
        const newImages = p.images.map(img => {
          const relative = cleanToRelative(img);
          if (relative !== img) changed = true;
          return relative;
        });
        if (changed) p.images = newImages;
      }
      if (p.videos && p.videos.length > 0) {
        const newVideos = p.videos.map(vid => {
          const relative = cleanToRelative(vid);
          if (relative !== vid) changed = true;
          return relative;
        });
        if (changed) p.videos = newVideos;
      }
      if (changed) {
        await p.save();
        productMigrationCount++;
      }
    }
    if (productMigrationCount > 0) {
      console.log(`✅ Migrated ${productMigrationCount} products' media URLs to relative paths.`);
    }

    // Migrate Gallery
    const galleryItems = await Gallery.find();
    let galleryMigrationCount = 0;
    for (let g of galleryItems) {
      let changed = false;
      if (g.image) {
        const relative = cleanToRelative(g.image);
        if (relative !== g.image) {
          g.image = relative;
          changed = true;
        }
      }
      if (g.video) {
        const relative = cleanToRelative(g.video);
        if (relative !== g.video) {
          g.video = relative;
          changed = true;
        }
      }
      if (changed) {
        await g.save();
        galleryMigrationCount++;
      }
    }
    if (galleryMigrationCount > 0) {
      console.log(`✅ Migrated ${galleryMigrationCount} gallery items' media URLs to relative paths.`);
    }
  } catch (migErr) {
    console.error('⚠️ Database media migration error:', migErr);
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
