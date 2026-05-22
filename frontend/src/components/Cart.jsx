// src/components/Cart.jsx
import React, { useCallback } from 'react';
import { ShoppingCart, MinusCircle, PlusCircle, Trash2, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Spinner from './Spinner';
import Swal from 'sweetalert2';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal, toggleCart, isLoadingCart, isCartOpen } = useCart();

  if (!isCartOpen) return null;

  const handleQuantityChange = useCallback(
    (id, delta) => {
      const item = cart.find((i) => (i._id || i.id) === id);
      if (item) {
        updateQuantity(id, item.quantity + delta);
      }
    },
    [cart, updateQuantity]
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="cart-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" onClick={toggleCart}></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md sm:max-w-lg">
          <div className="h-full flex flex-col bg-white shadow-2xl">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <h2 id="cart-title" className="text-xl sm:text-2xl font-bold text-gray-900">
                  Shopping Cart
                </h2>
                <button type="button" className="text-gray-400 hover:text-gray-900" onClick={toggleCart}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Cart synchronized with Firestore</p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6">
              {isLoadingCart ? (
                <Spinner message="Loading your cart..." />
              ) : cart.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                <ul role="list" className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <li key={item._id || item.id} className="py-4 sm:py-6 flex items-center">
                      <div className="flex-shrink-0 w-16 h-16 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        <img
                          src={item.images && item.images[0]}
                          alt={item.title || item.name}
                          className="w-full h-full object-contain object-center"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/400x300/f0f4ff/fbbf24?text=${encodeURIComponent(
                              item.title || item.name
                            )}`;
                          }}
                        />
                      </div>
                      <div className="ml-3 sm:ml-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3 className="text-sm sm:text-base truncate">{item.title || item.name}</h3>
                            <div className="flex flex-col items-end">
                              {item.discount > 0 && (
                                <span className="text-xs text-gray-400 line-through"> ₹{(item.price * item.quantity).toFixed(2)}</span>
                              )}
                              <p className="ml-2 sm:ml-4 text-sm sm:text-base text-yellow-600 font-bold">
                                 ₹{((item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price) * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <p className="mt-1 text-xs sm:text-sm text-gray-500"> 
                            ₹{(item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price).toFixed(2)} each
                            {item.discount > 0 && <span className="text-red-500 ml-2 font-bold">({item.discount}% OFF)</span>}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-1 sm:space-x-2 border border-gray-200 rounded-md p-0.5">
                            <button
                               onClick={() => handleQuantityChange(item._id || item.id, -1)}
                               className="p-1 text-gray-500 hover:text-red-500 disabled:opacity-50"
                               disabled={item.quantity <= 1}
                             >
                              <MinusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <span className="text-gray-900 font-medium text-sm sm:text-base w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item._id || item.id, 1)}
                              className="p-1 text-gray-500 hover:text-yellow-600"
                            >
                              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          </div>
                          <button
                            type="button"
                            className="font-medium text-red-500 hover:text-red-700 flex items-center text-xs sm:text-sm"
                            onClick={async () => {
                              const result = await Swal.fire({
                                title: 'Remove item?',
                                text: `Are you sure you want to remove ${item.title || item.name} from your cart?`,
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#fbbf24',
                                cancelButtonColor: '#ef4444',
                                confirmButtonText: 'Yes, remove it!',
                                cancelButtonText: 'Cancel',
                                background: '#ffffff',
                                color: '#1f2937'
                              });
                              if (result.isConfirmed) {
                                removeFromCart(item._id || item.id);
                                Swal.fire({
                                  title: 'Removed!',
                                  text: 'Item has been removed from your cart.',
                                  icon: 'success',
                                  confirmButtonColor: '#fbbf24',
                                  timer: 1500,
                                  showConfirmButton: false,
                                  background: '#ffffff',
                                  color: '#1f2937'
                                });
                              }
                            }}
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1" /> Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-gray-200 p-4 sm:p-6">
              <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                <p>Subtotal</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600"> ₹{cartTotal}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={async () => {
                    const result = await Swal.fire({
                      title: 'Confirm Purchase',
                      text: `Do you want to checkout items totaling ₹${cartTotal}?`,
                      icon: 'question',
                      showCancelButton: true,
                      confirmButtonColor: '#fbbf24',
                      cancelButtonColor: '#ef4444',
                      confirmButtonText: 'Yes, checkout!',
                      cancelButtonText: 'Cancel',
                      background: '#ffffff',
                      color: '#1f2937'
                    });
                    
                    if (result.isConfirmed) {
                      clearCart();
                      toggleCart();
                      Swal.fire({
                        title: 'Order Placed!',
                        text: 'Thank you for your purchase! Your order has been placed successfully.',
                        icon: 'success',
                        confirmButtonColor: '#fbbf24',
                        background: '#ffffff',
                        color: '#1f2937'
                      });
                    }
                  }}
                  disabled={cart.length === 0}
                  className="w-full flex items-center justify-center border border-transparent rounded-lg py-3 px-6 text-base font-bold text-gray-900 shadow-lg bg-yellow-400 hover:bg-yellow-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.005]"
                >
                  Checkout (₹{cartTotal})
                </button>
              </div>
              <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                <p>
                  or
                  <button
                    type="button"
                    className="font-medium text-yellow-600 hover:text-yellow-500 ml-1"
                    onClick={toggleCart}
                  >
                    Continue Shopping <span aria-hidden="true"> &rarr;</span>
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
