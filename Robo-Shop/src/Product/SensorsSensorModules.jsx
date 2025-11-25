import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../App.css";

const SensorsSensorModules = () => {
  const location = useLocation();
  const selectedCategory = location.state?.category || "All";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(selectedCategory);

  const API_MAP = {
    All: "http://localhost:5000/products",
    "Light, Sound & Colour": "http://localhost:5000/pro",
    "IR, Laser, Proximity & Ultrasonic": "http://localhost:5000/products/ir-laser-ultrasonic",
    "Gas, Temperature, Humidity": "http://localhost:5000/products/gas-temp-humidity",
    "Voltage, Current & Rotation": "http://localhost:5000/products/voltage-current-rotation",
    "Flex, Pressure & Vibration": "http://localhost:5000/products/flex-pressure-vibration",
    "Biomedical Sensor": "http://localhost:5000/products/biomedical",
    "Accelerometer, Magnetometer, Gyroscope": "http://localhost:5000/products/accelerometer",
    "Sensor Switch & Touch Switch": "http://localhost:5000/products/switch-touch",
    "Water, PH, Turbidity, Moisture & Flow": "http://localhost:5000/products/water-ph-flow",
  };

  useEffect(() => {
    fetchProducts(activeCategory);
  }, [activeCategory]);

  const fetchProducts = (category) => {
    setLoading(true);

    fetch(API_MAP[category])
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };
  

  // WISHLIST
  const handleAddToWishlist = (product) => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (!wishlist.some((item) => item.id === product.id)) {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      alert(`${product.name} added to wishlist!`);
    } else {
      alert(`${product.name} already in wishlist!`);
    }
  };
  // CART
  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };
  return (
    <div className="sensor-page">
      {/* LEFT SIDEBAR */}
      <div className="sensor-sidebar">
        <h3 onClick={() => fetchProducts("All")}>Sensors & Sensor Modules</h3>
        {Object.keys(API_MAP)
          .filter((key) => key !== "All")
          .map((category) => (
            <p key={category} onClick={() => fetchProducts(category)}>
              {category}
            </p>
          ))}
      </div>
      {/* RIGHT PRODUCTS */}
      <div className="sensor-products">
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div className="Shop-product-card" key={product.id}>
                <div
                  className="Shop-wishlist-icon"
                  onClick={() => handleAddToWishlist(product)}
                >
                  ❤️
                </div>
                 {/* Image import throught api */}
               <img src={`http://localhost:5000/uploads/${product.image}`} alt="" />
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
          </div>
        )}
      </div>
    </div>
  );
};

export default SensorsSensorModules;
