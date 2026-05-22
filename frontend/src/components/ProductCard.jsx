// src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  background: '#ffffff',
  color: '#1f2937',
  iconColor: '#eab308',
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

const ProductCard = ({ product, navigateToDetails }) => {
  const { addToCart } = useCart();
  const id = product._id || product.id;
  const title = product.title || product.name;

  // Manage favorite state persisted in localStorage
  const [isFavorited, setIsFavorited] = useState(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('roboshop_favorites') || '[]');
      return favs.includes(id);
    } catch {
      return false;
    }
  });

  const toggleFavorite = (e) => {
    e.stopPropagation();
    try {
      const favs = JSON.parse(localStorage.getItem('roboshop_favorites') || '[]');
      let newFavs;
      if (isFavorited) {
        newFavs = favs.filter(favId => favId !== id);
        Toast.fire({
          icon: 'success',
          title: `Removed ${title} from wishlist`
        });
      } else {
        newFavs = [...favs, id];
        Toast.fire({
          icon: 'success',
          title: `Added ${title} to wishlist!`
        });
      }
      localStorage.setItem('roboshop_favorites', JSON.stringify(newFavs));
      setIsFavorited(!isFavorited);
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  return (
    <div className="group flex flex-col h-full bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden hover-lift animate-fade-in-up hover:border-yellow-400 transition-all duration-300">
      {/* Image / Video Wrapper */}
      <div className="relative bg-gray-50 p-4 h-48 flex items-center justify-center overflow-hidden">
        {/* Wishlist Heart Icon */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 z-20 p-2 bg-white/90 hover:bg-white rounded-full shadow-md backdrop-blur-sm group/heart transition-all duration-200 focus:outline-none"
          title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-all duration-300 ${
              isFavorited
                ? 'fill-red-500 text-red-500 scale-110'
                : 'text-gray-400 group-hover/heart:text-red-500'
            }`}
          />
        </button>

        {product.videos && product.videos.length > 0 ? (
          <video
            src={product.videos[0]}
            poster={(product.images && product.images[0]) || product.image}
            className="w-full h-full object-contain cursor-pointer bg-black transition-transform duration-500 group-hover:scale-105"
            onClick={() => navigateToDetails(id)}
            onMouseOver={(e) => e.target.play().catch(() => { })}
            onMouseOut={(e) => { e.target.pause(); e.target.currentTime = 0; }}
            muted
            loop
          />
        ) : (
          <img
            src={(product.images && product.images[0]) || product.image}
            alt={title}
            className="w-full h-full object-contain cursor-pointer transition-transform duration-500 group-hover:scale-105"
            onClick={() => navigateToDetails(id)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/400x300/f0f4ff/fbbf24?text=${encodeURIComponent(title)}`;
            }}
          />
        )}
      </div>

      {/* Info Wrapper */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div className="flex-grow">
          <p className="text-xs font-semibold text-yellow-600 uppercase mb-1">{product.category}</p>
          <h3
            className="text-base font-bold text-gray-900 mb-2 line-clamp-1 cursor-pointer hover:text-yellow-600 transition"
            onClick={() => navigateToDetails(id)}
          >
            {title}
          </h3>
          <p className="text-gray-500 text-xs mb-4 line-clamp-2 min-h-[32px]">{product.description}</p>
        </div>

        <div className="mt-auto pt-2 border-t border-gray-100">
          <div className="flex justify-between items-end mb-3">
            <div className="flex flex-col min-h-[48px] justify-end">
              {product.discount > 0 ? (
                <>
                  <span className="text-[10px] text-red-500 font-bold uppercase leading-none mb-0.5">-{product.discount}% OFF</span>
                  <span className="text-xs text-gray-400 line-through leading-none"> ₹{product.price.toFixed(2)}</span>
                  <span className="text-lg font-extrabold text-yellow-600 leading-none mt-1">
                    ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-extrabold text-yellow-600 leading-none">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              addToCart(product);
              Toast.fire({
                icon: 'success',
                title: `${title} added to cart!`
              });
            }}
            className="w-full flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2.5 px-4 rounded-xl text-sm shadow-md transition-all duration-300 transform hover:scale-[1.02] focus:outline-none"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
