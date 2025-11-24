import React, { useEffect, useState } from "react";
import "../App.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    const withQty = stored.map((item) => ({ ...item, qty: item.qty || 1 }));
    setCartItems(withQty);
  }, []);

  const cleanPrice = (value) => Number(String(value).replace("₹", "").trim());

  // ---------- QUANTITY ----------
  const updateQty = (index, type) => {
    const updated = [...cartItems];

    if (type === "inc") updated[index].qty += 1;
    if (type === "dec" && updated[index].qty > 1) updated[index].qty -= 1;

    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // ---------- REMOVE ITEM ----------
  const handleRemove = (index) => {
    const updated = cartItems.filter((_, i) => i !== index);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // ---------- PRICE CALCULATIONS ----------
  const totalNewPrice = cartItems.reduce(
    (sum, item) => sum + cleanPrice(item.price) * item.qty,
    0
  );

  const totalOldPrice = cartItems.reduce(
    (sum, item) =>
      sum + (cleanPrice(item.oldPrice || cleanPrice(item.price) + 7000) * item.qty),
    0
  );

  const totalDiscount = totalOldPrice - totalNewPrice;
  const protectFee = cartItems.length * 29;
  const totalAmount = totalNewPrice + protectFee;

  return (
    <div className="cart-main">

      {/* LEFT SIDE CART ITEMS */}
      <div className="cart-left">
        {cartItems.map((item, index) => (
          <div className="cart-product-card" key={index}>
            
            {/* LEFT IMAGE + QTY */}
            <div className="prod-left">
              <img src={item.image} alt={item.name} className="prod-img" />

              <div className="qty-controls">
                <button onClick={() => updateQty(index, "dec")}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(index, "inc")}>+</button>
              </div>
            </div>

            {/* MIDDLE DETAILS */}
            <div className="prod-mid">
              <h3 className="prod-name">{item.name}</h3>
              <p className="prod-small-text">
                {item.desc || "Metallic Grey, 2.0 Channel"}
              </p>

              <p className="delivery-text">Delivery by Sun Nov 23</p>

              <div className="actions">
                <button className="save-later-btn">SAVE FOR LATER</button>
                <button className="remove-btn" onClick={() => handleRemove(index)}>
                  REMOVE
                </button>
              </div>
            </div>

            {/* RIGHT PRICE */}
            <div className="prod-right">
              <span className="price-new">₹{cleanPrice(item.price) * item.qty}</span>

              <span className="price-old">
                ₹{cleanPrice(item.oldPrice || cleanPrice(item.price) + 7000) * item.qty}
              </span>

              <span className="price-off">84% Off</span>

              <p className="protect-fee">+ ₹29 Protect Promise Fee</p>
            </div>

          </div>
        ))}
      </div>

      {/* RIGHT PRICE DETAILS BOX */}
      <div className="cart-right">
        <h3 className="price-title">PRICE DETAILS</h3>

        <div className="price-row">
          <span>Price ({cartItems.length} items)</span>
          <span>₹{totalOldPrice}</span>
        </div>

        <div className="price-row green">
          <span>Discount</span>
          <span>- ₹{totalDiscount}</span>
        </div>

        <div className="price-row">
          <span>Protect Promise Fee</span>
          <span>₹{protectFee}</span>
        </div>

        <hr />

        <div className="price-total">
          <span>Total Amount</span>
          <span>₹{totalAmount}</span>
        </div>

        <p className="save-msg">
          You will save ₹{totalDiscount} on this order
        </p>

        {/* PLACE ORDER BUTTON */}
        <button className="place-order-btn">PLACE ORDER</button>
      </div>
    </div>
  );
};

export default Cart;
