import React, { useState, useEffect } from 'react';
import axios from "axios";
import "../App.css";

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [products, setProducts] = useState([]);   // <-- API DATA
  const [loading, setLoading] = useState(true);   // <-- loader
  const [error, setError] = useState("");

  // =========================
  // 🔥 FETCH PRODUCTS FROM API
  // =========================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/products");

        // res.data should be an array of products
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleExpand = (category) => {
    setExpandedCategory(prev =>
      prev === category ? null : category
    );
  };

  // Add to Cart
  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  // Add to Wishlist
  const handleAddToWishlist = (product) => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (!wishlist.some(item => item.id === product.id)) {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      alert(`${product.name} added to wishlist!`);
    } else {
      alert(`${product.name} is already in your wishlist!`);
    }
  };

  // loader
  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading products...</h2>;
  }

  // error message
  if (error) {
    return <h2 style={{ color: "red", textAlign: "center" }}>{error}</h2>;
  }

  return (
    <div className="Shop-container">

      <main className="Shop-product-grid">
        {products.map((product) => (
          <div className="Shop-product-card" key={product.id}>
            
            <div
              className="Shop-wishlist-icon"
              onClick={() => handleAddToWishlist(product)}
            >
              ❤️
            </div>

            <img src={product.image} alt={product.name} />
            <h4>{product.name}</h4>

            <p className="Shop-price">
              <span className="Shop-old">Rs. {product.oldPrice}</span>
              <span className="Shop-new">Rs. {product.price}</span>
            </p>

            <button
              className="Shop-add-to-cart-btn"
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}
