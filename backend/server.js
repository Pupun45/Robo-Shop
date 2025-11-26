import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// ⭐ Fix dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ⭐ Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===============================
// ⭐ MongoDB Connection (Render)
// ===============================
// IMPORTANT: Put your MongoDB Atlas URL in .env → MONGO_URI
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected ✔"))
  .catch((err) => console.log("MongoDB Error:", err));


// ===============================
// ⭐ Product Schema
// ===============================
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  oldPrice: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true }
});

const Product = mongoose.model("Product", ProductSchema);
const ProProduct = mongoose.model("ProProduct", ProductSchema);


// ⭐ Root route - Fix "Cannot GET /"
app.get("/", (req, res) => {
  res.send("Backend Server Running ✔");
});


// ===============================
// ⭐ Normal Products
// ===============================
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/products/add", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ message: "Product added successfully!", product });
  } catch (err) {
    res.status(500).json({ error: "Failed to add product" });
  }
});


// ===============================
// ⭐ Pro Products
// ===============================
app.get("/pro", async (req, res) => {
  try {
    const products = await ProProduct.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/pro/add", async (req, res) => {
  try {
    const product = new ProProduct(req.body);
    await product.save();
    res.json({ message: "Pro product added successfully!", product });
  } catch (err) {
    res.status(500).json({ error: "Failed to add product" });
  }
});


// ===============================
// ⭐ PORT for Render
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
