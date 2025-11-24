import React, { useRef, useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../App.css";

const ShopCard = ({ items }) => {
  const carouselRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  const scrollSpeed = 1;
  const duplicatedItems = [...items, ...items];

  // Infinite smooth scroll
  useEffect(() => {
    const container = carouselRef.current;
    let frame;

    const autoScroll = () => {
      if (!isPaused && container) {
        container.scrollLeft += scrollSpeed;

        const maxScroll = container.scrollWidth / 2;
        if (container.scrollLeft >= maxScroll) container.scrollLeft = 0;
      }
      frame = requestAnimationFrame(autoScroll);
    };

    frame = requestAnimationFrame(autoScroll);

    return () => cancelAnimationFrame(frame);
  }, [isPaused]);

  const scroll = (direction) => {
    const container = carouselRef.current;
    if (direction === "left") {
      container.scrollBy({ left: -300, behavior: "smooth" });
    } else {
      container.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // ⭐ Auto generate ID if missing
  const ensureId = (product) => ({
    ...product,
    id: product.id || product._id || Date.now() + Math.random(),
  });

  // ⭐ Add to Wishlist
  const handleAddToWishlist = (product) => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const fixedProduct = ensureId(product);

    const exists = wishlist.some((item) => item.id === fixedProduct.id);

    if (!exists) {
      wishlist.push(fixedProduct);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      alert(`${product.name} added to wishlist!`);
    } else {
      alert(`${product.name} is already in wishlist!`);
    }
  };

  // ⭐ Add to Cart + Navigate
  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...cart, ensureId(product)];

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert(`${product.name} added to cart!`);
    navigate("/carts");
  };

  // ⭐ Quick Add to Cart (carousel)
  const scrollAddToCart = (product) => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...storedCart, ensureId(product)];

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="ShopCarousel-wrapper">
      <div
        className="ShopCarousel-controls"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <button className="ShopCarousel-btn left" onClick={() => scroll("left")}>
          ←
        </button>

        <div className="ShopCarousel-container" ref={carouselRef}>
          {duplicatedItems.map((item, index) => (
            <div className="ShopCarousel-card" key={index}>

              <div
                className="Shop-wishlist-icon"
                onClick={() => handleAddToWishlist(item)}
              >
                ❤️
              </div>
              <img
                src={item.image}
                alt={item.name}
                className="Shop-img"
              />
              <h4 className="Shop-title">{item.name}</h4>

              <p className="Shop-price">₹{item.price}</p>

              <button
                className="scroll-cart-btn"
                onClick={() => scrollAddToCart(item)}
              >
                <FaShoppingCart />
              </button>
            </div>
          ))}
        </div>
        <button className="ShopCarousel-btn right" onClick={() => scroll("right")}>
          →
        </button>
      </div>
    </div>
  );
};

export default ShopCard;
