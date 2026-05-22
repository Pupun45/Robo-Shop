// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthReady } = useAuth();
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('roboshop_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoadingCart, setIsLoadingCart] = useState(false);

  useEffect(() => {
    localStorage.setItem('roboshop_cart', JSON.stringify(cart));
  }, [cart]);

  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const addToCart = useCallback(
    (product) => {
      setCart((prevCart) => {
        const pId = product._id || product.id;
        const existingItem = prevCart.find((item) => (item._id || item.id) === pId);
        let newCart;

        if (existingItem) {
          newCart = prevCart.map((item) =>
            (item._id || item.id) === pId ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          newCart = [...prevCart, { ...product, quantity: 1, _id: pId, id: pId }];
        }
        return newCart;
      });
    },
    []
  );

  const updateQuantity = useCallback(
    (id, newQuantity) => {
      setCart((prevCart) => {
        let newCart;
        if (newQuantity <= 0) {
          newCart = prevCart.filter((item) => (item._id || item.id) !== id);
        } else {
          newCart = prevCart.map((item) =>
            (item._id || item.id) === id ? { ...item, quantity: newQuantity } : item
          );
        }
        return newCart;
      });
    },
    []
  );

  const removeFromCart = useCallback(
    (id) => {
      setCart((prevCart) => {
        const newCart = prevCart.filter((item) => (item._id || item.id) !== id);
        return newCart;
      });
    },
    []
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => {
      const actualPrice = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
      return total + actualPrice * item.quantity;
    }, 0).toFixed(2),
    [cart]
  );

  const cartItemCount = useMemo(
    () => cart.reduce((count, item) => count + item.quantity, 0),
    [cart]
  );

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartTotal,
      cartItemCount,
      isCartOpen,
      toggleCart,
      isLoadingCart,
    }),
    [cart, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal, cartItemCount, isCartOpen, toggleCart, isLoadingCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
