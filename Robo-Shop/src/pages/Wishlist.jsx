import React, { useEffect, useState } from "react";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistItems(storedWishlist);
  }, []);

  const handleRemove = (index) => {
    const updatedWishlist = wishlistItems.filter((_, i) => i !== index);
    setWishlistItems(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  const moveToCart = (item, index) => {
    // Get current cart
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];

    // Add item to cart
    currentCart.push(item);
    localStorage.setItem("cart", JSON.stringify(currentCart));

    // Remove item from wishlist
    handleRemove(index);
  };

  return (
    <div className="wishlist-container">
      {wishlistItems.length === 0 ? (
        <p className="empty-msg">No items in your wishlist yet.</p>
      ) : (
        <div className="wishlist-items">
          {wishlistItems.filter(Boolean).map((item, index) => (
            <div key={index} className="wishlist-item">
              <img
                src={item.image || "https://via.placeholder.com/150"}
                alt={item.name || "Product"}
                className="wishlist-image"
              />
              <div className="wishlist-details">
                <h3>{item.name}</h3>
                <p>Price: Rs. {item.price}</p>
              </div>
              <div style={{ marginTop: "10px" }}>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(index)}
                >
                  ❌ Remove
                </button>
                <button
                  className="move-cart-btn"
                  onClick={() => moveToCart(item, index)}
                >
                  🛒 Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
