// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductProvider, useProducts } from './context/ProductContext';
import { CartProvider, useCart } from './context/CartContext';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import Home from './pages/Home';
import Products from './pages/Products';
import Login, { SignUpPage } from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import { Navigate } from 'react-router-dom';
import { initialProducts, initialGallery } from './data/products';
import { AlertCircle, ArrowLeft, HardDrive, Code, Lightbulb, Printer, MapPin, Phone, Mail, Headset, Wifi, Heart, X, Loader2, CheckCircle, Sparkles, ShoppingCart } from 'lucide-react';
import Spinner from './components/Spinner';
import Swal from 'sweetalert2';
import { ProductDetailSkeleton } from './components/SkeletonLoader';

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

const IconMap = { AlertCircle, HardDrive, Code, Lightbulb, Printer, MapPin, Phone, Mail, Headset, Wifi };

// InterestModal removed as part of wishlist transition

const GalleryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null); // { url, type }
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/gallery`);
        setItems(res.data);
      } catch (error) {
        console.error('Gallery fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [apiUrl]);

  return (
    <section className="py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">Project Gallery</h1>
      <p className="text-xl text-gray-500 mb-10 text-center max-w-3xl mx-auto">
        Showcasing our completed projects, from high-tech custom builds to innovative IoT solutions.
      </p>

      {loading ? (
        <Spinner message="Loading gallery projects..." />
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No projects in gallery yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <GalleryItem key={item._id || item.id} item={item} onOpenMedia={setSelectedMedia} />
          ))}
        </div>
      )}

      {/* Full Screen Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 transition-all animate-in fade-in duration-300" onClick={() => setSelectedMedia(null)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          {selectedMedia.video ? (
            <video src={selectedMedia.video} poster={selectedMedia.image} controls autoPlay className="max-w-full max-h-full shadow-2xl rounded-sm outline-none" onClick={(e) => e.stopPropagation()} />
          ) : (
            <img src={selectedMedia.image} alt="Full Screen" className="max-w-full max-h-full object-contain shadow-2xl rounded-sm" />
          )}
        </div>
      )}
    </section>
  );
};

const GalleryItem = ({ item, onOpenMedia }) => {
  const handleClick = () => {
    if (item.link && item.link.trim() !== '') {
      window.open(item.link, '_blank');
    } else {
      onOpenMedia({ video: item.video, image: item.image });
    }
  };

  return (
    <div 
      className="group relative bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover-lift animate-fade-in-up cursor-pointer"
      onClick={handleClick}
    >
      {item.video ? (
        <video
          src={item.video}
          poster={item.image}
          className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110 bg-black"
          muted
          loop
          onMouseOver={(e) => e.target.play().catch(()=>{})}
          onMouseOut={(e) => { e.target.pause(); e.target.currentTime = 0; }}
        />
      ) : (
        <img
          src={item.image}
          alt={item.caption}
          className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/600x400/3730a3/e0e7ff?text=${encodeURIComponent(item.caption)}`;
          }}
        />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
        {item.link ? (
           <div className="bg-white/90 text-indigo-600 p-4 rounded-2xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-2xl">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
           </div>
        ) : (
           <div className="bg-white/90 text-gray-700 p-4 rounded-2xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-2xl">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
           </div>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-6 h-1/2 bg-gradient-to-t from-black/95 via-black/50 to-transparent">
        <p className="text-xl sm:text-2xl font-black text-white">{item.caption}</p>
        {item.description && <p className="text-sm text-gray-300 mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.description}</p>}
        {item.link && <p className="text-xs text-indigo-300 font-bold mt-3 uppercase tracking-widest flex items-center">Visit Website <span className="ml-2 animate-bounce-x">→</span></p>}
      </div>
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  
  const product = products.find((p) => p._id === id || p.id === parseInt(id) || p.id === id);
  const [activeMedia, setActiveMedia] = useState({ url: '', type: 'image', poster: '' });

  // Wishlist / Favorite state
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
    if (!product) return;
    try {
      const favs = JSON.parse(localStorage.getItem('roboshop_favorites') || '[]');
      let newFavs;
      const title = product.title || product.name;
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

  const productPrice = typeof product?.price === 'number' ? product.price : parseFloat(product?.price) || 0;
  const productDiscount = typeof product?.discount === 'number' ? product.discount : parseFloat(product?.discount) || 0;
  const hasProductDiscount = productDiscount > 0;
  const productFinalPrice = hasProductDiscount ? productPrice * (1 - productDiscount / 100) : productPrice;

  const suggestedProducts = React.useMemo(() => {
    if (!product || !products) return [];
    const currentId = String(product._id || product.id || '');
    const others = products.filter(p => {
      const pId = String(p._id || p.id || '');
      return pId !== currentId;
    });
    return others.slice(0, 5);
  }, [product, products]);

  const carouselRef = React.useRef(null);

  useEffect(() => {
    if (suggestedProducts.length === 0 || !carouselRef.current) return;
    
    let isHovered = false;
    const container = carouselRef.current;
    
    const handleMouseEnter = () => { isHovered = true; };
    const handleMouseLeave = () => { isHovered = false; };
    
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    const interval = setInterval(() => {
      if (isHovered) return;
      
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: 300, behavior: 'smooth' });
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [suggestedProducts]);

  useEffect(() => {
    if (product) {
      if (product.videos && product.videos.length > 0) {
        setActiveMedia({ url: product.videos[0], type: 'video', poster: (product.images && product.images[0]) || product.image });
      } else if (product.images && product.images.length > 0) {
        setActiveMedia({ url: product.images[0], type: 'image' });
      } else if (product.image) {
        setActiveMedia({ url: product.image, type: 'image' });
      }
    }
  }, [product]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
        <h1 className="text-2xl font-bold text-gray-900">Product Not Found</h1>
        <button
          onClick={() => navigate('/products')}
          className="mt-6 text-yellow-600 hover:text-yellow-800 font-medium flex items-center justify-center mx-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 p-6 md:p-10 lg:flex lg:space-x-10">
        <div className="lg:w-1/2 flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6 mb-6 lg:mb-0 relative">
          <div className="relative w-full h-80 md:h-[480px] flex items-center justify-center mb-4 overflow-hidden rounded-lg bg-black/5">
            {/* Wishlist Heart Icon */}
            <button
              onClick={toggleFavorite}
              className="absolute top-4 right-4 z-20 p-3 bg-white/95 hover:bg-white rounded-full shadow-lg backdrop-blur-sm group/heart transition-all duration-200 focus:outline-none"
              title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={`w-5 h-5 transition-all duration-300 ${
                  isFavorited
                    ? 'fill-red-500 text-red-500 scale-110'
                    : 'text-gray-400 group-hover/heart:text-red-500'
                }`}
              />
            </button>

            {activeMedia.url ? (
              activeMedia.type === 'video' ? (
                <video
                  key={activeMedia.url}
                  src={activeMedia.url}
                  poster={activeMedia.poster}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={activeMedia.url}
                  alt={product.title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/600x400/f0f4ff/4f46e5?text=${encodeURIComponent(product.title || product.name)}`;
                  }}
                />
              )
            ) : (
              <div className="flex items-center justify-center text-gray-400">
                <Spinner message="Preparing media..." />
              </div>
            )}
          </div>
          
          {/* Thumbnails */}
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {product.images?.map((img, i) => (
              <img 
                key={`img-${i}`} 
                src={img} 
                className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 transition-all ${activeMedia.url === img ? 'border-yellow-500 scale-110 shadow-md' : 'border-transparent hover:border-gray-300'}`}
                onClick={() => setActiveMedia({ url: img, type: 'image' })}
              />
            ))}
            {product.videos?.map((vid, i) => (
              <div 
                key={`vid-${i}`}
                className={`relative w-16 h-16 rounded-md cursor-pointer border-2 overflow-hidden transition-all ${activeMedia.url === vid ? 'border-yellow-500 scale-110 shadow-md' : 'border-transparent hover:border-gray-300'}`}
                onClick={() => setActiveMedia({ url: vid, type: 'video', poster: product.images?.[0] })}
              >
                <video src={vid} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white border-b-[4px] border-b-transparent ml-0.5"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/2">
          <p className="text-sm font-semibold text-yellow-600 uppercase mb-2">{product.category}</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">{product.title || product.name}</h1>
          <div className="flex items-center space-x-3 mb-6">
            {hasProductDiscount ? (
              <>
                <span className="text-3xl font-bold text-yellow-600"> ₹{productFinalPrice.toFixed(2)}</span>
                <span className="text-xl text-gray-400 line-through"> ₹{productPrice.toFixed(2)}</span>
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded">-{productDiscount}% OFF</span>
              </>
            ) : (
              <p className="text-3xl font-bold text-yellow-600"> ₹{productPrice.toFixed(2)}</p>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Overview</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description} This product is meticulously engineered for optimal performance and durability, meeting
              the highest industry standards for reliability and innovation. Perfect for professional and enthusiast use.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                addToCart(product);
                Toast.fire({
                  icon: 'success',
                  title: `${product.title || product.name} added to cart!`
                });
              }}
              className="w-full flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3.5 px-6 rounded-xl text-lg shadow-md transition duration-300 transform hover:scale-[1.005] gap-2"
            >
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            {product.hostingLink && (
              <a
                href={product.hostingLink.startsWith('http') ? product.hostingLink : `https://${product.hostingLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 px-6 rounded-xl text-lg shadow-md transition duration-300 transform hover:scale-[1.005] gap-2"
              >
                <Sparkles className="w-5 h-5 text-yellow-400" /> Live Project / Hosting Link
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Suggested Products Section */}
      {suggestedProducts.length > 0 && (
        <div className="mt-16 border-t border-gray-100 pt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" /> Other Products
          </h2>
          <div ref={carouselRef} className="flex gap-6 overflow-x-auto pb-6 pt-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-thin scrollbar-thumb-yellow-200 scrollbar-track-transparent scroll-smooth">
            {suggestedProducts.map((p) => {
              const pId = p._id || p.id;
              const pPrice = typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0;
              const pDiscount = typeof p.discount === 'number' ? p.discount : parseFloat(p.discount) || 0;
              const hasDiscount = pDiscount > 0;
              const finalPrice = hasDiscount ? pPrice * (1 - pDiscount / 100) : pPrice;
              
              return (
                <div 
                  key={pId} 
                  onClick={() => {
                    navigate(`/products/${pId}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-shrink-0 w-72 bg-white rounded-2xl border border-gray-100 hover:border-yellow-100 shadow-sm hover:shadow-md transition duration-300 p-5 cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-full h-40 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center mb-4 relative p-2">
                      {(p.images && p.images[0]) || p.image ? (
                        <img 
                          src={(p.images && p.images[0]) || p.image} 
                          alt={p.title || p.name} 
                          className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/600x400/f0f4ff/fbbf24?text=${encodeURIComponent(p.title || p.name)}`;
                          }}
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">No Image</span>
                      )}
                      {hasDiscount && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded shadow">
                          -{pDiscount}%
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-yellow-600 font-semibold uppercase tracking-wider block mb-1">{p.category}</span>
                    <h3 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-yellow-600 transition line-clamp-1">{p.title || p.name}</h3>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-yellow-600">₹{finalPrice.toFixed(2)}</span>
                      {hasDiscount && (
                        <span className="text-xs text-gray-400 line-through">₹{pPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <button className="mt-3 w-full py-2 bg-yellow-50 text-yellow-700 font-semibold rounded-lg text-xs hover:bg-yellow-400 hover:text-gray-900 transition duration-200">
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const ServicesPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/services`);
        setServices(res.data);
      } catch (error) {
        console.error('Services fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [apiUrl]);

  const defaultServices = [
    { name: 'Data Recovery', description: 'Advanced file retrieval from damaged drives.', icon: HardDrive, color: 'text-red-500' },
    { name: 'Full-Stack Development', description: 'Custom web and mobile solutions.', icon: Code, color: 'text-yellow-600' },
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  return (
    <section className="py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">Our Expert Services</h1>
      <p className="text-xl text-gray-500 mb-10 text-center max-w-3xl mx-auto">
        Beyond retail, we offer specialized technical services to power your projects and secure your data.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? <div className="col-span-2"><Spinner message="Loading services..." /></div> : displayServices.map((service) => (
          <div
            key={service._id || service.name}
            className="bg-white p-8 rounded-xl shadow-xl border border-gray-100 hover:shadow-2xl transition duration-300"
          >
            {(() => {
              const IconComponent = IconMap[service.icon] || HardDrive;
              return <IconComponent className={`w-10 h-10 ${service.color} mb-4`} />;
            })()}
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.name}</h3>
            <p className="text-gray-600 mb-6">{service.description}</p>
            <button
              onClick={() => navigate('/contact')}
              className="text-yellow-600 font-semibold hover:text-yellow-800 flex items-center transition duration-300"
            >
              Inquire Now <ArrowLeft className="w-4 h-4 ml-1 transform rotate-180" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-lg text-gray-600 mb-4">See examples of our work in the Project Gallery:</p>
        <button
          onClick={() => navigate('/gallery')}
          className="bg-yellow-400 border border-yellow-400 text-gray-900 font-bold py-3 px-8 rounded-full shadow-md hover:bg-yellow-500 transition duration-300 transform hover:scale-105"
        >
          View Project Gallery
        </button>
      </div>
    </section>
  );
};

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    ourLocation: '123 Robo Way, Robot City, CA 90210',
    salesLine: '+1 (555) 123-4567',
    generalInquiry: 'info@roboshop.com',
    supportCenter: 'support@roboshop.com'
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/contact/info`);
        setContactInfo(res.data);
      } catch (err) {
        console.error('Failed to fetch contact details:', err.response?.data || err);
      }
    };
    fetchContactInfo();
  }, [apiUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    Swal.fire({
      title: 'Submitting...',
      text: 'Please wait while we submit your inquiry.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    try {
      const dataToSubmit = {
        ...formData,
        createdAt: new Date().toISOString(),
      };
      
      const sheetDbUrl = import.meta.env.VITE_SHEETDB_URL || 'https://sheetdb.io/api/v1/lkw4spfohdtut';
      axios.post(sheetDbUrl, { data: dataToSubmit }).catch(err => console.error("SheetDB error:", err));

      await axios.post(`${apiUrl}/api/contact`, dataToSubmit);

      Swal.fire({
        title: 'Thank you!',
        text: 'Thank you for your inquiry! We will respond shortly.',
        icon: 'success',
        confirmButtonColor: '#fbbf24',
        background: '#ffffff',
        color: '#1f2937'
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Contact form submission error:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to submit message. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: '#ffffff',
        color: '#1f2937'
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full p-3 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition duration-300 shadow-sm';

  return (
    <section className="py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">Get in Touch</h1>
      <p className="text-xl text-gray-500 mb-10 text-center max-w-3xl mx-auto">
        Have a question about a product or need a specialized service? Contact us directly.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-8 p-6 bg-yellow-50 rounded-xl shadow-lg border border-yellow-100">
          <ContactDetail icon={MapPin} title="Our Location" value={contactInfo.ourLocation} />
          <ContactDetail icon={Phone} title="Sales Line" value={contactInfo.salesLine} />
          <ContactDetail icon={Mail} title="General Inquiry" value={contactInfo.generalInquiry} />
          <ContactDetail icon={Headset} title="Support Center" value={contactInfo.supportCenter} />
        </div>

        <div className="lg:col-span-2 p-8 bg-white rounded-xl shadow-xl border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message / Request
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className={inputClass}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center text-gray-900 font-bold py-3 px-6 rounded-lg text-lg shadow-md transition duration-300 transform hover:scale-[1.005] ${loading ? 'bg-yellow-200 cursor-not-allowed text-gray-400' : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'}`}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const ContactDetail = ({ icon: Icon, title, value }) => (
  <div className="flex items-start space-x-4">
    <Icon className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
    <div>
      <h4 className="text-sm font-semibold text-yellow-700">{title}</h4>
      <p className="text-gray-700 font-medium">{value}</p>
    </div>
  </div>
);

const Footer = () => {
  const { user } = useAuth();
  const userId = user?.uid || 'Not available';
  const [contactInfo, setContactInfo] = useState({
    ourLocation: '123 Robo Way, Robot City, CA 90210',
    salesLine: '+1 (555) 123-4567',
    generalInquiry: 'info@roboshop.com',
    supportCenter: 'support@roboshop.com'
  });
  const [footerSettings, setFooterSettings] = useState({
    brandDescription: 'Leading the way in robotics, retail, and custom engineering solutions.',
    products: ['Robotics Gear', '3D Printing', 'IoT Devices', 'Embedded Systems'],
    services: ['Robotics Consulting', 'Dev Consulting', 'Prototyping', 'Customer Support'],
    copyrightText: 'Robo Shop. All rights reserved.'
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/contact/info`);
        if (res.data) {
          setContactInfo(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch contact details for footer:', err.response?.data || err);
      }
    };
    const fetchFooterSettings = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/footer`);
        if (res.data) {
          setFooterSettings({
            brandDescription: res.data.brandDescription || 'Leading the way in robotics, retail, and custom engineering solutions.',
            products: res.data.products || ['Robotics Gear', '3D Printing', 'IoT Devices', 'Embedded Systems'],
            services: res.data.services || ['Robotics Consulting', 'Dev Consulting', 'Prototyping', 'Customer Support'],
            copyrightText: res.data.copyrightText || 'Robo Shop. All rights reserved.'
          });
        }
      } catch (err) {
        console.error('Failed to fetch footer settings:', err.response?.data || err);
      }
    };
    fetchContactInfo();
    fetchFooterSettings();
  }, [apiUrl]);

  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-lg font-bold mb-4 text-yellow-400">Robo Shop</h4>
            <p className="text-sm text-gray-400">{footerSettings.brandDescription}</p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4 text-yellow-400">Products</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {footerSettings.products.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4 text-yellow-400">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {footerSettings.services.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4 text-yellow-400">Connect</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" /> 
                <span className="break-words">{contactInfo.ourLocation}</span>
              </p>
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" /> {contactInfo.salesLine}
              </p>
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" /> {contactInfo.generalInquiry}
              </p>
              <p className="flex items-center">
                <Headset className="w-4 h-4 mr-2 flex-shrink-0" /> {contactInfo.supportCenter}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} {footerSettings.copyrightText}</p>
          <p className="text-xs text-gray-500 mt-1">User ID: {userId}</p>
        </div>
      </div>
    </footer>
  );
};

const Layout = ({ children }) => {
  const { isAuthReady } = useAuth();

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner message="Initializing Application..." size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      <Cart />
      <Footer />
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { adminToken } = useAuth();
  if (!adminToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => (
  <AuthProvider>
    <ProductProvider>
      <CartProvider>
        <Layout>
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: '',
              style: {
                border: '1px solid #e2e8f0',
                padding: '16px',
                color: '#1e293b',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                fontWeight: '500'
              },
              success: {
                iconTheme: {
                  primary: '#fbbf24',
                  secondary: '#ffffff',
                },
              },
            }} 
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </CartProvider>
    </ProductProvider>
  </AuthProvider>
);

export default App;
