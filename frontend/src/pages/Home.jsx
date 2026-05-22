// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Code, Lock, Headset, BookOpen, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/SkeletonLoader';
import { useProducts } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const { products, loading } = useProducts();

  const bannerSlides = [
    {
      image: '/banner_robotic_arm.png',
      title: 'Next-Gen Robotics and Automation',
      description: 'Explore state-of-the-art robotic controllers and parts designed for absolute precision.',
      link: '/products'
    },
    {
      image: '/banner_iot_circuits.png',
      title: 'Advanced IoT & Embedded Systems',
      description: 'Get cutting-edge development boards, sensors, and components for your next smart solution.',
      link: '/products'
    },
    {
      image: '/banner_ai_drones.png',
      title: 'Autonomous AI Drones & Smart Tech',
      description: 'Discover quadcopters, flight controllers, and intelligent machine vision hardware.',
      link: '/products'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);

  return (
    <div className="space-y-16 overflow-hidden">
      {/* Scrolling Banner Slider */}
      <section className="relative w-full h-[280px] sm:h-[400px] md:h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl group border border-gray-200 bg-gray-900">
        {bannerSlides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Overlay shadow */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent z-10" />
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-[4000ms] ease-out"
              />
              {/* Content */}
              <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-8 sm:px-16 md:px-24 max-w-2xl z-20 text-white space-y-4">
                <span className="inline-block px-3 py-1 bg-yellow-400 text-gray-900 text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-full self-start shadow-md">
                  New Technology
                </span>
                <h2 className="text-2xl sm:text-5xl font-black leading-tight tracking-tight drop-shadow-md">
                  {slide.title}
                </h2>
                <p className="text-xs sm:text-base text-gray-200 drop-shadow max-w-lg leading-relaxed">
                  {slide.description}
                </p>
                <button
                  onClick={() => navigate(slide.link)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-5 sm:py-2.5 sm:px-6 rounded-xl text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 self-start shadow-lg hover:shadow-yellow-500/20 focus:outline-none"
                >
                  Explore Now
                </button>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10 focus:outline-none"
        >
          <span className="text-lg sm:text-xl font-bold">&larr;</span>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10 focus:outline-none"
        >
          <span className="text-lg sm:text-xl font-bold">&rarr;</span>
        </button>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {bannerSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                idx === currentSlide ? 'w-8 bg-yellow-400' : 'w-2 bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </section>



      {/* Featured Picks */}
      <section>
        <h3 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">Featured Picks</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full">
              <ProductGridSkeleton count={3} />
            </div>
          ) : (
            products.slice(0, 3).map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                navigateToDetails={() => navigate(`/products/${product._id || product.id}`)}
              />
            ))
          )}
        </div>
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/products')}
            className="text-yellow-600 hover:text-yellow-800 font-bold flex items-center justify-center mx-auto transition duration-300"
          >
            View All Products
            <span className="ml-1 transform rotate-180">&larr;</span>
          </button>
        </div>
      </section>

      {/* New Section 1: Robo Tech Insights */}
      <section className="py-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">Robo Tech Insights</h3>
            <p className="text-gray-500 mt-2 text-base sm:text-lg">Stay ahead with expert guides and hardware tutorials curated by our engineers.</p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 md:mt-0 text-yellow-600 hover:text-yellow-800 font-bold flex items-center transition"
          >
            Explore Learning Hub
            <span className="ml-2">&rarr;</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InsightCard
            tag="AI & Robotics"
            title="Building Autonomous Drones: A Beginner's Roadmap"
            description="Learn the core concepts of drone flight control, motor calibration, and onboard computer configuration using Raspberry Pi and Pixhawk."
            readTime="5 min read"
            date="May 20, 2026"
          />
          <InsightCard
            tag="Software"
            title="Introduction to ROS2 publisher-subscriber nodes"
            description="Why ROS2 is the global standard for commercial robotics engineering, and how to write your first publish-subscribe nodes in Python."
            readTime="8 min read"
            date="May 18, 2026"
          />
          <InsightCard
            tag="3D Printing"
            title="3D Printing Tips: Perfect Bed Adhesion & Filament Speeds"
            description="Optimize bed temperature leveling, extruder speeds, and retraction adjustments to eliminate warping and get flawless physical prints."
            readTime="4 min read"
            date="May 15, 2026"
          />
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-gray-50 rounded-[2rem] p-8 sm:p-12 shadow-inner border border-gray-100">
        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose Robo Shop?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <ValuePropCard
            icon={Lock}
            title="Secure & Private"
            description="All data is handled with industry-standard security protocols for a private shopping experience."
            delay="delay-0"
          />
          <ValuePropCard
            icon={Code}
            title="Cutting-Edge Tech"
            description="We specialize in the latest hardware, full-stack development, and IoT smart devices."
            delay="delay-150"
          />
          <ValuePropCard
            icon={Headset}
            title="Expert Support"
            description="Dedicated technical support available 24/7 for all your professional needs."
            delay="delay-300"
          />
        </div>
      </section>

      {/* New Section 2: Developer Testimonials & Reviews */}
      <section className="py-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">What the Community Says</h3>
          <p className="text-gray-500 mt-2 text-base sm:text-lg">Loved by hobbyists, university labs, and enterprise developers alike.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestimonialCard
            author="Dr. Aris Thorne"
            role="Robotics Professor, Tech Institute"
            quote="The development tools and sensors from Robo Shop have been a game-changer for our lab's drone research. Fast shipping and detailed docs."
            initials="AT"
          />
          <TestimonialCard
            author="Meera Nair"
            role="CTO, AgriSmart IoT"
            quote="Their full-stack support and custom 3D prototyping services helped us launch our IoT agricultural smart-sensor prototype two weeks ahead of schedule."
            initials="MN"
          />
          <TestimonialCard
            author="Jameson Miller"
            role="Embedded Systems Developer"
            quote="Robo Shop's curation of development boards is unmatched. The customer service is fast, friendly, and deeply technical."
            initials="JM"
          />
        </div>
      </section>
    </div>
  );
};

const ValuePropCard = ({ icon: Icon, title, description, delay }) => (
  <div className={`p-8 bg-white rounded-2xl shadow-xl border border-gray-100 hover-lift animate-fade-in-up ${delay}`}>
    <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
      <Icon className="w-8 h-8 text-yellow-600" />
    </div>
    <h4 className="text-2xl font-bold text-gray-900 mb-3">{title}</h4>
    <p className="text-gray-500 leading-relaxed text-sm">{description}</p>
  </div>
);

const InsightCard = ({ tag, title, description, readTime, date }) => (
  <div className="group bg-white border border-gray-250 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-yellow-400 flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="px-2.5 py-1 bg-yellow-50 text-yellow-700 text-[10px] font-bold uppercase tracking-wider rounded-lg">
          {tag}
        </span>
        <span className="text-[10px] text-gray-400 font-medium">{date}</span>
      </div>
      <h4 className="text-base font-bold text-gray-900 group-hover:text-yellow-600 transition-colors duration-200 mb-2 leading-snug">
        {title}
      </h4>
      <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
        {description}
      </p>
    </div>
    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-[10px] font-semibold text-gray-400">
      <span>{readTime}</span>
      <span className="text-yellow-600 group-hover:text-yellow-700 font-bold transition flex items-center">
        Read Article <span className="ml-1 transition-transform group-hover:translate-x-1">&rarr;</span>
      </span>
    </div>
  </div>
);

const TestimonialCard = ({ author, role, quote, initials }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 shadow-inner relative flex flex-col justify-between hover:border-yellow-300 transition-colors duration-300">
    <div className="flex space-x-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="text-yellow-500 text-base leading-none">&#9733;</span>
      ))}
    </div>
    <p className="text-gray-600 italic text-xs sm:text-sm leading-relaxed mb-6">
      "{quote}"
    </p>
    <div className="flex items-center space-x-3 mt-auto">
      <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900 text-xs sm:text-sm shadow-md flex-shrink-0">
        {initials}
      </div>
      <div>
        <h5 className="text-xs sm:text-sm font-bold text-gray-900">{author}</h5>
        <p className="text-[10px] text-gray-500">{role}</p>
      </div>
    </div>
  </div>
);

export default Home;
