// src/pages/Login.jsx
import React, { useState } from 'react';
import { LogIn, User, Phone, Lock, UserCheck, Eye, EyeOff, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthLayout = ({ title, children, isLogin, toggleAuthMode }) => {
  return (
    <div className="flex justify-center items-center py-12 px-4 min-h-[calc(100vh-14rem)] bg-gray-50/50 animate-fade-in">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden grid md:grid-cols-2 transition-all duration-300">
        
        {/* Left Column: Premium Image & Dynamic Content */}
        <div className="relative hidden md:block bg-gray-900 overflow-hidden">
          <img 
            src="/auth_banner_v2.png" 
            alt="Robo Shop Auth Banner" 
            className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/45 to-transparent flex flex-col justify-end p-10 text-white">
            <span className="text-yellow-400 font-bold tracking-widest text-xs uppercase mb-2">Robo Shop Premium Experience</span>
            <h1 className="text-3xl font-black mb-4 tracking-tight leading-tight">
              {isLogin ? "Welcome Back to the Robo Shop!" : "Join the Community of Robo Creators!"}
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-md">
              {isLogin 
                ? "Sign in to access your orders, track robotics tasks, request custom IoT systems, and view developer services." 
                : "Register for a free store account. Build portfolios, submit IoT interest forms, and view unhashed passwords in the administration module."
              }
            </p>
            <div className="flex items-center space-x-4 border-t border-white/10 pt-6">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center border-2 border-gray-900 text-[10px] font-bold text-gray-900">3D</div>
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center border-2 border-gray-900 text-[10px] font-bold text-gray-900">IoT</div>
                <div className="w-8 h-8 rounded-full bg-yellow-300 flex items-center justify-center border-2 border-gray-900 text-[10px] font-bold text-gray-900">AI</div>
              </div>
              <p className="text-xs text-gray-400 font-medium">Dynamic, customized solutions & products</p>
            </div>
          </div>
        </div>

        {/* Right Column: Auth Form */}
        <div className="flex flex-col justify-center p-8 sm:p-12 md:p-16">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{title}</h2>
            <p className="text-sm text-gray-500 mb-8">
              Join or sign into our store platform
            </p>

            {children}

            <p className="mt-8 text-center text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="ml-1 font-semibold text-yellow-600 hover:text-yellow-700 transition duration-200 underline"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export const SignUpPage = () => {
  const navigate = useNavigate();
  const { userLogin } = useAuth();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Creating account...');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/users/signup`, {
        name,
        mobile,
        email,
        password
      });

      userLogin(response.data.token, response.data.user);
      toast.success('Welcome to Robo Shop! 🎉', { id: toastId });
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.response?.data?.message || 'Failed to create account. Mobile or email may already be in use.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full py-2.5 px-3.5 pl-10 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 outline-none transition duration-300 text-gray-800 text-sm shadow-sm';
  const labelClass = 'block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5';

  return (
    <AuthLayout title="Create Account" isLogin={false} toggleAuthMode={() => navigate('/login')}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className={labelClass}>Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="e.g. Rahul Sharma"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="mobile" className={labelClass}>Mobile Number</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className={inputClass}
              placeholder="e.g. 9876543210"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>Gmail / Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="e.g. rahul@gmail.com"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} pr-10`}
              placeholder="Minimum 6 characters"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 text-gray-900 font-bold py-3 rounded-xl text-base shadow-lg transition duration-200"
        >
          <UserCheck className="w-5 h-5 mr-2" /> Sign Up
        </button>
      </form>
    </AuthLayout>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const { adminLogin, userLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Logging in...');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/users/login`, {
        email,
        password
      });

      if (response.data.isAdmin) {
        adminLogin(response.data.token);
        toast.success('Welcome back, Admin! 🛠️', { id: toastId });
        navigate('/admin/dashboard');
      } else {
        userLogin(response.data.token, response.data.user);
        toast.success(`Welcome back, ${response.data.user.name}! 👋`, { id: toastId });
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Invalid email or password.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full py-2.5 px-3.5 pl-10 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 outline-none transition duration-300 text-gray-800 text-sm shadow-sm';
  const labelClass = 'block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5';

  return (
    <AuthLayout
      title="Sign In"
      isLogin={true}
      toggleAuthMode={() => navigate('/signup')}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className={labelClass}>Gmail / Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="e.g. rahul@gmail.com"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} pr-10`}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 text-gray-900 font-bold py-3 rounded-xl text-base shadow-lg transition duration-200"
        >
          <LogIn className="w-5 h-5 mr-2" /> Log In
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;
