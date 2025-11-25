import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ⭐ Serve uploads folder
app.use("/uploads", express.static("uploads"));


mongoose
  .connect("mongodb://localhost:27017")
  .then(() => console.log("MongoDB Connected ✔"))
  .catch((err) => console.log("MongoDB Error:", err));

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  oldPrice: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true }
});

const Product = mongoose.model("Product", ProductSchema);
const ProProduct = mongoose.model("ProProduct", ProductSchema);

// GET products
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ADD product
app.post("/products/add", async (req, res) => {
  const { name, oldPrice, price, image } = req.body;
  const product = new Product({ name, oldPrice, price, image });
  await product.save();
  res.json({ message: "Product added successfully!", product });
});

// GET PRO products
app.get("/pro", async (req, res) => {
  const products = await ProProduct.find();
  res.json(products);
});

// ADD PRO product
app.post("/pro/add", async (req, res) => {
  const { name, oldPrice, price, image } = req.body;
  const product = new ProProduct({ name, oldPrice, price, image });
  await product.save();
  res.json({ message: "Pro product added successfully!", product });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
