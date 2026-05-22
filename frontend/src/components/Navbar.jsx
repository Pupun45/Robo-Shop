// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Home, Package, Headset, Image, Mail, LogIn, LogOut, User, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, userToken, signOut, adminToken } = useAuth();
  const { cartItemCount, toggleCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Gallery', path: '/gallery', icon: Image },
    { name: 'Services', path: '/services', icon: Headset },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  if (adminToken) {
    navItems.push({ name: 'Admin Dashboard', path: '/admin/dashboard', icon: User });
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0 cursor-pointer flex items-center space-x-2" onClick={() => { navigate('/'); setIsOpen(false); }}>
            <span className="text-xl sm:text-2xl font-extrabold text-gray-900 hover:text-yellow-600 transition duration-300">
              Robo <span className="text-yellow-600">Shop</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex space-x-4 lg:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-yellow-600 border-b-2 border-transparent hover:border-yellow-500 transition duration-300"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Auth section + Mobile Hamburger */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Desktop active user details */}
            <div className="hidden lg:flex items-center text-sm text-gray-500">
              <User className="w-4 h-4 mr-1 text-yellow-600" />
              {adminToken ? (
                <span title="Logged in as Admin">Administrator</span>
              ) : userToken && user ? (
                <span title={`Logged in as ${user.name}`}>User: {user.name}</span>
              ) : (
                'Guest Session'
              )}
            </div>

            {/* Cart Icon Button with Badge */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-700 hover:text-yellow-600 focus:outline-none transition duration-300"
              aria-label="Toggle Shopping Cart"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Auth Trigger Buttons */}
            {adminToken ? (
              <button
                onClick={signOut}
                className="p-2 rounded-full text-red-500 hover:text-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Sign Out Admin"
                title="Sign Out Admin"
              >
                <LogOut className="w-6 h-6" />
              </button>
            ) : userToken && user ? (
              <div className="flex items-center space-x-2">
                <div
                  onClick={signOut}
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 flex items-center justify-center font-bold text-lg shadow-md cursor-pointer transition-all duration-300 transform hover:scale-105"
                  title={`Logged in as ${user.name}. Click to log out.`}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={signOut}
                  className="p-1 rounded-full text-gray-400 hover:text-red-500 transition duration-200"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="p-2 rounded-full text-yellow-600 hover:text-yellow-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                aria-label="Log In"
                title="Log In"
              >
                <LogIn className="w-6 h-6" />
              </button>
            )}

            {/* Hamburger Button (Mobile Only) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-700 hover:text-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 p-2 rounded-md transition duration-300"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200 shadow-inner">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
              className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition duration-300"
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </button>
          ))}

          <div className="border-t border-gray-200 mt-2 pt-2 space-y-1">
            {adminToken ? (
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition duration-300"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out Admin
              </button>
            ) : userToken && user ? (
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center font-bold mr-3">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="flex items-center text-sm font-medium text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4 mr-1" /> Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  navigate('/login');
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-yellow-600 hover:bg-yellow-50 transition duration-300"
              >
                <LogIn className="w-5 h-5 mr-3" />
                Log In / Sign Up
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
