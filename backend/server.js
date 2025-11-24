import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// =========================
// 🔥 CONNECT TO MONGODB
// =========================
mongoose
  .connect("mongodb://localhost:27017")
  .then(() => console.log("MongoDB Connected ✔"))
  .catch((err) => console.log("MongoDB Error:", err));

// =========================
// 📌 PRODUCT SCHEMA
// =========================
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  oldPrice: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true }
});

const Product = mongoose.model("Product", ProductSchema);

// =========================
// 📌 GET ALL PRODUCTS
// =========================
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
});
app.post("/products/add", async (req, res) => {
  try {
    const { name, oldPrice, price, image } = req.body;

    const product = new Product({ name, oldPrice, price, image });
    await product.save();

    res.json({ message: "Product added successfully!", product });
  } catch (err) {
    console.log("Product Add Error:", err);  // <-- 👈 SHOW REAL ERROR
    res.status(500).json({ message: "Error adding product", error: err.message });
  }
});


// =========================
// 🚀 START SERVER
// =========================
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
