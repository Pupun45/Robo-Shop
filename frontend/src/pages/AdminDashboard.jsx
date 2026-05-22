import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, LogOut, Package, Mail, Image as ImageIcon, Briefcase, Trash, Minus, Users, Tag, UserCheck, Lock, Eye, EyeOff, Sliders } from 'lucide-react';
import Spinner from '../components/Spinner';

const AdminDashboard = () => {
  const { adminToken, adminLogout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [catLoading, setCatLoading] = useState(false);

  // Contact details configuration state
  const [contactInfoData, setContactInfoData] = useState({
    ourLocation: '',
    salesLine: '',
    generalInquiry: '',
    supportCenter: ''
  });
  const [infoLoading, setInfoLoading] = useState(false);

  // User Logins Tab State
  const [usersList, setUsersList] = useState([]);
  const [isUserEditing, setIsUserEditing] = useState(false);
  const [userEditData, setUserEditData] = useState({ _id: '', name: '', mobile: '', email: '', password: '' });
  const [showUserEditPassword, setShowUserEditPassword] = useState(false);

  // Admin Credentials State
  const [currentAdminEmail, setCurrentAdminEmail] = useState('admin@roboshop.com');
  const [currentAdminPassword, setCurrentAdminPassword] = useState('adminpassword123');
  const [isAdminEditing, setIsAdminEditing] = useState(false);
  const [adminEditData, setAdminEditData] = useState({ email: '', password: '' });
  const [showAdminEditPassword, setShowAdminEditPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [visibleUserPasswords, setVisibleUserPasswords] = useState({});

  // Footer settings state
  const [footerData, setFooterData] = useState({
    brandDescription: '',
    products: '',
    services: '',
    copyrightText: ''
  });
  const [footerLoading, setFooterLoading] = useState(false);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    _id: '',
    title: '',
    description: '',
    price: '',
    category: '',
    discount: '0',
    hostingLink: '',
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [productVideoFiles, setProductVideoFiles] = useState([]);
  const [productVideoPreviews, setProductVideoPreviews] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);

  // Gallery Form State
  const [galleryCaption, setGalleryCaption] = useState('');
  const [galleryDescription, setGalleryDescription] = useState('');
  const [galleryLink, setGalleryLink] = useState('');
  const [galleryImage, setGalleryImage] = useState(null);
  const [galleryImagePreview, setGalleryImagePreview] = useState(null);
  const [galleryVideo, setGalleryVideo] = useState(null);
  const [galleryVideoPreview, setGalleryVideoPreview] = useState(null);

  // Service Form State
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', icon: 'HardDrive', color: 'text-yellow-600' });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5117';

  useEffect(() => {
    if (!adminToken) {
      navigate('/login');
      return;
    }
    fetchData();
    fetchCategories();
  }, [adminToken, activeTab]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const res = await axios.get(`${apiUrl}/api/products`);
        setProducts(res.data);
      } else if (activeTab === 'contacts') {
        const res = await axios.get(`${apiUrl}/api/contact`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        setContacts(res.data);
        try {
          const infoRes = await axios.get(`${apiUrl}/api/contact/info`);
          setContactInfoData(infoRes.data);
        } catch (e) {
          console.error("Failed to fetch contact details:", e);
        }
      } else if (activeTab === 'gallery') {
        const res = await axios.get(`${apiUrl}/api/gallery`);
        setGalleryItems(res.data);
      } else if (activeTab === 'services') {
        const res = await axios.get(`${apiUrl}/api/services`);
        setServices(res.data);
      } else if (activeTab === 'customers') {
        const res = await axios.get(`${apiUrl}/api/customers`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        setCustomers(res.data);
      } else if (activeTab === 'logins') {
        const res = await axios.get(`${apiUrl}/api/users`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        setUsersList(res.data);
        try {
          const adminRes = await axios.get(`${apiUrl}/api/admin/credentials`, {
            headers: { Authorization: `Bearer ${adminToken}` }
          });
          setCurrentAdminEmail(adminRes.data.email);
          if (adminRes.data.plainPassword) {
            setCurrentAdminPassword(adminRes.data.plainPassword);
          }
        } catch (e) {
          console.error("Failed to fetch admin email:", e);
        }
      } else if (activeTab === 'footer') {
        try {
          const res = await axios.get(`${apiUrl}/api/footer`);
          if (res.data) {
            setFooterData({
              brandDescription: res.data.brandDescription || '',
              products: res.data.products ? res.data.products.join('\n') : '',
              services: res.data.services ? res.data.services.join('\n') : '',
              copyrightText: res.data.copyrightText || ''
            });
          }
        } catch (e) {
          console.error("Failed to fetch footer settings:", e);
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
      if (error.response && error.response.status === 401) {
        toast.error('Session expired or invalid. Please log in again.');
        adminLogout();
        navigate('/login');
        return;
      }
      const errorMsg = error.response?.data?.error || error.message || 'Failed to fetch data';
      toast.error(`Fetch error: ${errorMsg}`);
      // Fallback for contacts if GET /api/contact is not implemented
      if (activeTab === 'contacts') {
        console.warn('Could not fetch contacts. (Endpoint might not exist yet)');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024).slice(0, 10);
    if (files.length > 10) toast.error('Max 10 images allowed');
    setImageFiles(validFiles);
    setImagePreviews(validFiles.map(file => URL.createObjectURL(file)));
  };

  const handleProductVideoChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.size <= 50 * 1024 * 1024).slice(0, 2);
    if (files.length > 2) toast.error('Max 2 videos allowed');
    setProductVideoFiles(validFiles);
    setProductVideoPreviews(validFiles.map(file => URL.createObjectURL(file)));
  };

  const removeImage = (index, isExisting) => {
    if (isExisting) {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setImageFiles(prev => prev.filter((_, i) => i !== index));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const removeVideo = (index, isExisting) => {
    if (isExisting) {
      setExistingVideos(prev => prev.filter((_, i) => i !== index));
    } else {
      setProductVideoFiles(prev => prev.filter((_, i) => i !== index));
      setProductVideoPreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ _id: '', title: '', description: '', price: '', category: '', discount: '0', hostingLink: '' });
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    setProductVideoFiles([]);
    setProductVideoPreviews([]);
    setExistingVideos([]);
    setIsEditing(false);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading(isEditing ? 'Updating product...' : 'Adding product...');
    
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('discount', formData.discount);
      data.append('hostingLink', formData.hostingLink || '');
      if (isEditing) {
        data.append('existingImages', JSON.stringify(existingImages));
        data.append('existingVideos', JSON.stringify(existingVideos));
      }
      imageFiles.forEach(file => data.append('image', file));
      productVideoFiles.forEach(file => data.append('video', file));

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${adminToken}`
        }
      };

      if (isEditing) {
        await axios.put(`${apiUrl}/api/products/${formData._id}`, data, config);
        toast.success('Product updated successfully!', { id: toastId });
      } else {
        await axios.post(`${apiUrl}/api/products`, data, config);
        toast.success('Product added successfully!', { id: toastId });
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        toast.error('Session expired. Please log in again.', { id: toastId });
        adminLogout();
        navigate('/login');
        return;
      }
      toast.error(error.response?.data?.message || 'Error saving product', { id: toastId });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    const toastId = toast.loading('Deleting product...');
    try {
      await axios.delete(`${apiUrl}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      toast.success('Product deleted!', { id: toastId });
      fetchData();
    } catch (error) {
      toast.error('Failed to delete product', { id: toastId });
    }
  };

  const handleEdit = (product) => {
    setFormData({
      _id: product._id,
      title: product.title || product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      discount: product.discount || '0',
      hostingLink: product.hostingLink || '',
    });
    setExistingImages(product.images || []);
    setImagePreviews([]);
    setExistingVideos(product.videos || []);
    setProductVideoPreviews([]);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleAddGallery = async (e) => {
    e.preventDefault();
    if (!galleryImage && !galleryVideo) return toast.error('Please select an image or video');
    const toastId = toast.loading('Adding media...');
    try {
      const data = new FormData();
      if (galleryImage) data.append('image', galleryImage);
      if (galleryVideo) data.append('video', galleryVideo);
      data.append('caption', galleryCaption);
      data.append('description', galleryDescription);
      data.append('link', galleryLink);
      await axios.post(`${apiUrl}/api/gallery`, data, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${adminToken}` }
      });
      toast.success('Media added to gallery!', { id: toastId });
      setGalleryCaption('');
      setGalleryDescription('');
      setGalleryLink('');
      setGalleryImage(null);
      setGalleryImagePreview(null);
      setGalleryVideo(null);
      setGalleryVideoPreview(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to add photo', { id: toastId });
    }
  };

  const handleDeleteGallery = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      await axios.delete(`${apiUrl}/api/gallery/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      toast.success('Photo deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete photo');
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/services`, serviceForm, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      toast.success('Service added!');
      setServiceForm({ name: '', description: '', icon: 'HardDrive', color: 'text-yellow-600' });
      fetchData();
    } catch (error) {
      toast.error('Failed to add service');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await axios.delete(`${apiUrl}/api/services/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      toast.success('Service deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await axios.delete(`${apiUrl}/api/contact/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      toast.success('Message deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const handleUpdateContactInfo = async (e) => {
    e.preventDefault();
    setInfoLoading(true);
    const toastId = toast.loading('Updating contact details...');
    try {
      const res = await axios.put(`${apiUrl}/api/contact/info`, contactInfoData, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setContactInfoData(res.data);
      toast.success('Contact details updated successfully!', { id: toastId });
    } catch (error) {
      console.error('Failed to update contact info:', error);
      toast.error('Failed to update contact details.', { id: toastId });
    } finally {
      setInfoLoading(false);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Delete this customer interest entry?')) return;
    try {
      await axios.delete(`${apiUrl}/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      toast.success('Entry deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete entry');
    }
  };

  const handleAddCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return toast.error('Category name cannot be empty.');
    setCatLoading(true);
    try {
      await axios.post(`${apiUrl}/api/categories`, { name }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      toast.success(`Category "${name}" added!`);
      setNewCategoryName('');
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add category');
    } finally {
      setCatLoading(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Remove category "${name}"?`)) return;
    try {
      await axios.delete(`${apiUrl}/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      toast.success(`Category "${name}" removed`);
      fetchCategories();
    } catch (err) {
      toast.error('Failed to remove category');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user login?')) return;
    try {
      await axios.delete(`${apiUrl}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      toast.success('User deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleOpenEditUserModal = (user) => {
    setUserEditData({ _id: user._id, name: user.name, mobile: user.mobile, email: user.email || '', password: '' });
    setShowUserEditPassword(false);
    setIsUserEditing(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${apiUrl}/api/users/${userEditData._id}`, {
        name: userEditData.name,
        mobile: userEditData.mobile,
        email: userEditData.email,
        password: userEditData.password
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      toast.success('User details updated successfully');
      setIsUserEditing(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleOpenEditAdminModal = () => {
    setAdminEditData({ email: currentAdminEmail, password: '' });
    setShowAdminEditPassword(false);
    setIsAdminEditing(true);
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Updating admin credentials...');
    try {
      const res = await axios.put(`${apiUrl}/api/admin/credentials`, {
        email: adminEditData.email,
        password: adminEditData.password
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      toast.success('Admin credentials updated successfully', { id: toastId });
      setCurrentAdminEmail(res.data.email);
      if (res.data.plainPassword) {
        setCurrentAdminPassword(res.data.plainPassword);
      }
      setIsAdminEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update credentials', { id: toastId });
    }
  };

  const handleUpdateFooter = async (e) => {
    e.preventDefault();
    setFooterLoading(true);
    const toastId = toast.loading('Saving footer settings...');
    try {
      const prodArray = footerData.products.split('\n').map(item => item.trim()).filter(item => item !== '');
      const servArray = footerData.services.split('\n').map(item => item.trim()).filter(item => item !== '');

      await axios.put(`${apiUrl}/api/footer`, {
        brandDescription: footerData.brandDescription,
        products: prodArray,
        services: servArray,
        copyrightText: footerData.copyrightText
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      toast.success('Footer settings saved successfully!', { id: toastId });
    } catch (err) {
      console.error('Failed to update footer:', err);
      toast.error(err.response?.data?.message || 'Failed to save footer settings', { id: toastId });
    } finally {
      setFooterLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-xl mt-4">
      {/* Sidebar / Navigation Bar */}
      <div className="w-full md:w-64 bg-gray-900 text-white flex flex-col border-b md:border-b-0 md:border-r border-gray-800">
        <div className="p-4 md:p-6 border-b border-gray-800 flex justify-between items-center md:block">
          <h2 className="text-xl md:text-2xl font-bold text-yellow-400">Admin Panel</h2>
          <button
            onClick={handleLogout}
            className="md:hidden flex items-center justify-center bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-lg transition duration-300"
          >
            <LogOut className="w-3.5 h-3.5 mr-1" /> Logout
          </button>
        </div>
        
        {/* Scrollable Navigation Tabs */}
        <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible py-2 md:py-4 px-2 md:px-0 scrollbar-none gap-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-shrink-0 md:w-full flex items-center px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-none transition duration-300 ${activeTab === 'products' ? 'bg-yellow-400 text-gray-900 font-bold border-b-2 md:border-b-0 md:border-l-4 border-gray-900' : 'hover:bg-gray-800 text-gray-300'}`}
          >
            <Package className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" /> Products
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex-shrink-0 md:w-full flex items-center px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-none transition duration-300 ${activeTab === 'gallery' ? 'bg-yellow-400 text-gray-900 font-bold border-b-2 md:border-b-0 md:border-l-4 border-gray-900' : 'hover:bg-gray-800 text-gray-300'}`}
          >
            <ImageIcon className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" /> Gallery
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`flex-shrink-0 md:w-full flex items-center px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-none transition duration-300 ${activeTab === 'services' ? 'bg-yellow-400 text-gray-900 font-bold border-b-2 md:border-b-0 md:border-l-4 border-gray-900' : 'hover:bg-gray-800 text-gray-300'}`}
          >
            <Briefcase className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" /> Services
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex-shrink-0 md:w-full flex items-center px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-none transition duration-300 ${activeTab === 'contacts' ? 'bg-yellow-400 text-gray-900 font-bold border-b-2 md:border-b-0 md:border-l-4 border-gray-900' : 'hover:bg-gray-800 text-gray-300'}`}
          >
            <Mail className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" /> Contacts
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`flex-shrink-0 md:w-full flex items-center px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-none transition duration-300 ${activeTab === 'customers' ? 'bg-yellow-400 text-gray-900 font-bold border-b-2 md:border-b-0 md:border-l-4 border-gray-900' : 'hover:bg-gray-800 text-gray-300'}`}
          >
            <Users className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" /> Customers
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-shrink-0 md:w-full flex items-center px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-none transition duration-300 ${activeTab === 'categories' ? 'bg-yellow-400 text-gray-900 font-bold border-b-2 md:border-b-0 md:border-l-4 border-gray-900' : 'hover:bg-gray-800 text-gray-300'}`}
          >
            <Tag className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" /> Categories
          </button>
          <button
            onClick={() => setActiveTab('logins')}
            className={`flex-shrink-0 md:w-full flex items-center px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-none transition duration-300 ${activeTab === 'logins' ? 'bg-yellow-400 text-gray-900 font-bold border-b-2 md:border-b-0 md:border-l-4 border-gray-900' : 'hover:bg-gray-800 text-gray-300'}`}
          >
            <UserCheck className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" /> Logins
          </button>
          <button
            onClick={() => setActiveTab('footer')}
            className={`flex-shrink-0 md:w-full flex items-center px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-none transition duration-300 ${activeTab === 'footer' ? 'bg-yellow-400 text-gray-900 font-bold border-b-2 md:border-b-0 md:border-l-4 border-gray-900' : 'hover:bg-gray-800 text-gray-300'}`}
          >
            <Sliders className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" /> Footer
          </button>
        </div>
        
        {/* Desktop Logout Footer */}
        <div className="hidden md:block p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-white">
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
              <button
                onClick={() => { resetForm(); setShowForm(!showForm); }}
                className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-md transition duration-300"
              >
                {showForm ? 'Cancel' : <><Plus className="w-5 h-5 mr-1" /> Add Product</>}
              </button>
            </div>

            {showForm && (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner mb-8">
                <h3 className="text-xl font-bold mb-4">{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title / Name</label>
                      <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                      <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        required
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 bg-white"
                      >
                        <option value="">— Select a Category —</option>
                        {categories.map(cat => (
                          <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                      <input type="number" name="discount" value={formData.discount} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-500" placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hosting Link</label>
                      <input type="text" name="hostingLink" value={formData.hostingLink} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-500" placeholder="e.g. https://myproject.vercel.app" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Photos (Max 10)</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {existingImages.map((src, i) => (
                          <div key={`exist-img-${i}`} className="relative h-12 w-12 group">
                            <img src={src} alt="Preview" className="h-full w-full object-cover rounded-md border" />
                            <button type="button" onClick={() => removeImage(i, true)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm">
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                        {imagePreviews.map((src, i) => (
                          <div key={`new-img-${i}`} className="relative h-12 w-12 group">
                            <img src={src} alt="Preview" className="h-full w-full object-cover rounded-md border border-yellow-200" />
                            <button type="button" onClick={() => removeImage(i, false)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm">
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center w-max">
                        <ImageIcon className="w-4 h-4 mr-2" /> Select Photos
                        <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Videos (Max 2, 50MB each)</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {existingVideos.map((src, i) => (
                          <div key={`exist-vid-${i}`} className="relative h-12 w-12 group">
                            <video src={src} className="h-full w-full object-cover rounded-md border" />
                            <button type="button" onClick={() => removeVideo(i, true)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm">
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                        {productVideoPreviews.map((src, i) => (
                          <div key={`new-vid-${i}`} className="relative h-12 w-12 group">
                            <video src={src} className="h-full w-full object-cover rounded-md border border-yellow-200" />
                            <button type="button" onClick={() => removeVideo(i, false)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm">
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center w-max">
                        <ImageIcon className="w-4 h-4 mr-2" /> Select Videos
                        <input type="file" className="hidden" accept="video/*" multiple onChange={handleProductVideoChange} />
                      </label>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea required rows="3" name="description" value={formData.description} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"></textarea>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition duration-300 shadow-md">
                      {isEditing ? 'Update Product' : 'Save Product'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <Spinner message="Loading products..." />
            ) : (
              <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.length === 0 ? (
                      <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No products found.</td></tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product._id || product.id} className="hover:bg-gray-50 transition duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded border flex items-center justify-center overflow-hidden">
                                {product.videos && product.videos.length > 0 ? (
                                  <video className="h-10 w-10 object-cover bg-black" src={product.videos[0]} poster={product.images && product.images[0]} muted />
                                ) : product.images && product.images.length > 0 ? (
                                  <img className="h-10 w-10 object-cover" src={product.images[0]} alt="" />
                                ) : (
                                  <ImageIcon className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{product.title || product.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-amber-800">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{product.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => handleEdit(product)} className="text-yellow-600 hover:text-amber-800 mr-4">
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleDelete(product._id || product.id)} className="text-red-600 hover:text-red-900">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Tag className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manage Categories</h1>
                <p className="text-sm text-gray-500">Add or remove product categories shown across the store.</p>
              </div>
            </div>

            <div className="max-w-lg">
              {/* Add new category */}
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                  placeholder="e.g. AI ML Project, Robotics..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-sm shadow-sm"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  disabled={catLoading}
                  title="Add category"
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 text-gray-900 text-2xl font-bold transition-all shadow-md flex-shrink-0"
                >
                  +
                </button>
              </div>

              {/* Stats */}
              <div className="mb-4 flex items-center gap-2">
                <span className="text-xs font-semibold bg-yellow-100 text-amber-800 px-3 py-1 rounded-full">
                  {categories.length} {categories.length === 1 ? 'category' : 'categories'}
                </span>
                <span className="text-xs text-gray-400">Press Enter or click + to add</span>
              </div>

              {/* Category list */}
              {categories.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <Tag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No categories yet</p>
                  <p className="text-gray-400 text-sm mt-1">Type a name above and press + to add one.</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {categories.map((cat, index) => (
                    <li
                      key={cat._id}
                      className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-3.5 hover:border-yellow-300 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-400 w-5 text-center">{index + 1}</span>
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat._id, cat.name)}
                        title="Remove category"
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xl font-bold leading-none opacity-70 group-hover:opacity-100"
                      >
                        −
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Contact Management</h1>
              <p className="text-sm text-gray-500">Configure public contact details and view user inquiry submissions.</p>
            </div>

            {/* Dynamic Contact Details Configuration Panel */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-10">
              <h3 className="text-xl font-bold mb-4 text-amber-950 flex items-center gap-2">
                <Mail className="w-5 h-5 text-yellow-600 animate-pulse" />
                Store Contact Information (Left Side of Contact Tab)
              </h3>
              <form onSubmit={handleUpdateContactInfo} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Our Location</label>
                    <input
                      required
                      type="text"
                      value={contactInfoData.ourLocation}
                      onChange={(e) => setContactInfoData({ ...contactInfoData, ourLocation: e.target.value })}
                      placeholder="e.g. 123 Fusion Ave, Tech City, CA"
                      className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm bg-gray-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Sales Line</label>
                    <input
                      required
                      type="text"
                      value={contactInfoData.salesLine}
                      onChange={(e) => setContactInfoData({ ...contactInfoData, salesLine: e.target.value })}
                      placeholder="e.g. +1 (555) 123-4567"
                      className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm bg-gray-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">General Inquiry Email</label>
                    <input
                      required
                      type="email"
                      value={contactInfoData.generalInquiry}
                      onChange={(e) => setContactInfoData({ ...contactInfoData, generalInquiry: e.target.value })}
                      placeholder="e.g. info@roboshop.com"
                      className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm bg-gray-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Support Center Email</label>
                    <input
                      required
                      type="email"
                      value={contactInfoData.supportCenter}
                      onChange={(e) => setContactInfoData({ ...contactInfoData, supportCenter: e.target.value })}
                      placeholder="e.g. support@roboshop.com"
                      className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm bg-gray-50/50"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={infoLoading}
                    className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 text-gray-900 font-bold py-2 px-6 rounded-lg shadow-md transition duration-200"
                  >
                    {infoLoading ? 'Saving...' : 'Save Contact Details'}
                  </button>
                </div>
              </form>
            </div>

            {/* Submissions Section */}
            <h3 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2">User Inquiries & Submissions</h3>
            {loading ? (
              <Spinner message="Loading contacts..." />
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {contacts.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No contact submissions found in database.</p>
                  </div>
                ) : (
                  contacts.map((contact, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow border border-gray-100 hover:border-yellow-200 transition duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold mr-4">
                            {contact.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{contact.name}</h3>
                            <p className="text-sm text-yellow-600 font-medium">{contact.email} • {contact.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                            {contact.createdAt ? new Date(contact.createdAt).toLocaleString() : 'Recent'}
                          </span>
                          <button 
                            onClick={() => handleDeleteContact(contact._id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Submission"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-gray-700 text-sm border border-gray-100 leading-relaxed">
                        {contact.message}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'gallery' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Gallery Management</h1>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
              <h3 className="text-xl font-bold mb-4">Upload New Media</h3>
              <form onSubmit={handleAddGallery} className="flex flex-col md:flex-row items-end gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                  <input required type="text" value={galleryCaption} onChange={(e) => setGalleryCaption(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="e.g. New Workstation Setup" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input type="text" value={galleryDescription} onChange={(e) => setGalleryDescription(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="e.g. Built using React & IoT" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hosting Link (Optional)</label>
                  <input type="text" value={galleryLink} onChange={(e) => setGalleryLink(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="e.g. https://project.com" />
                </div>
                <div className="flex-shrink-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photo (Max 5MB)</label>
                  <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center h-[42px]">
                    <ImageIcon className="w-4 h-4 mr-2" /> {galleryImage ? 'Change Photo' : 'Select Photo'}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                      const file = e.target.files[0];
                      if(file) { 
                        if (file.size > 5 * 1024 * 1024) return toast.error('Photo exceeds 5MB limit');
                        setGalleryImage(file); 
                        setGalleryImagePreview(URL.createObjectURL(file)); 
                      }
                    }} />
                  </label>
                </div>
                <div className="flex-shrink-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video (Max 50MB)</label>
                  <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center h-[42px]">
                    <ImageIcon className="w-4 h-4 mr-2" /> {galleryVideo ? 'Change Video' : 'Select Video'}
                    <input type="file" className="hidden" accept="video/*" onChange={(e) => {
                      const file = e.target.files[0];
                      if(file) { 
                        if (file.size > 50 * 1024 * 1024) return toast.error('Video exceeds 50MB limit');
                        setGalleryVideo(file); 
                        setGalleryVideoPreview(URL.createObjectURL(file)); 
                      }
                    }} />
                  </label>
                </div>
                <button type="submit" className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg hover:bg-yellow-500 font-bold h-[42px]">Add to Gallery</button>
              </form>
              {(galleryImagePreview || galleryVideoPreview) && (
                <div className="mt-4 flex gap-4">
                  {galleryImagePreview && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Photo Preview:</p>
                      <img src={galleryImagePreview} alt="Preview" className="h-32 rounded-lg shadow-md" />
                    </div>
                  )}
                  {galleryVideoPreview && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Video Preview:</p>
                      <video src={galleryVideoPreview} controls className="h-32 rounded-lg shadow-md" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {loading ? <Spinner message="Loading Gallery..." /> : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryItems.map((item) => (
                  <div key={item._id} className="relative rounded-xl overflow-hidden border bg-white shadow-sm flex flex-col">
                    {item.video ? (
                      <video src={item.video} poster={item.image} controls className="w-full h-40 object-cover bg-black" />
                    ) : (
                      <img src={item.image} alt={item.caption} className="w-full h-40 object-cover" />
                    )}
                    <div className="p-3 flex justify-between items-center bg-gray-50">
                      <p className="text-sm font-medium truncate flex-1 mr-2">{item.caption}</p>
                      <button onClick={() => handleDeleteGallery(item._id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors" title="Delete Media">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'services' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Services</h1>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
              <h3 className="text-xl font-bold mb-4">Add New Service</h3>
              <form onSubmit={handleAddService} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                  <input required type="text" value={serviceForm.name} onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})} className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input required type="text" value={serviceForm.description} onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})} className="w-full p-2 border rounded-lg" />
                </div>
                <div className="flex justify-end md:col-span-2">
                  <button type="submit" className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg hover:bg-yellow-500 font-bold">Add Service</button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {services.map((service) => (
                <div key={service._id} className="bg-white p-5 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm hover:border-yellow-200 transition duration-300">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-50 rounded-lg mr-4">
                      <Briefcase className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{service.name}</h3>
                      <p className="text-sm text-gray-500">{service.description}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteService(service._id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors" title="Delete Service">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'customers' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Customer Interests</h1>
            {loading ? (
              <Spinner message="Loading customers..." />
            ) : (
              <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mobile</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Interested In</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted At</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {customers.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-10 text-center text-gray-400">
                          <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                          No customer interest submissions yet.
                        </td>
                      </tr>
                    ) : (
                      customers.map((c, index) => (
                        <tr key={c._id} className="hover:bg-yellow-50 transition duration-150">
                          <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm mr-3">
                                {c.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-semibold text-gray-900 text-sm">{c.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 font-medium">{c.mobile}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 max-w-[180px] truncate" title={c.address}>{c.address}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-amber-800">
                              {c.productName}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-400">
                            {c.createdAt ? new Date(c.createdAt).toLocaleString() : 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleDeleteCustomer(c._id)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete Entry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'logins' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Registered Logins</h1>

            {/* Admin Credentials Panel at Top */}
            <div className="bg-gradient-to-r from-slate-900 to-gray-950 text-white p-6 rounded-2xl border border-yellow-600 shadow-xl mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-1 bg-yellow-500/20 text-yellow-400 rounded-lg">
                    <Lock className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg font-bold">Admin Credentials</h3>
                </div>
                <p className="text-sm text-slate-400">View and modify active credentials for the administrator console.</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 text-sm">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold block tracking-wider mb-0.5">Admin Email</span>
                  <span className="font-mono text-yellow-300 font-medium select-all">{currentAdminEmail}</span>
                </div>
                <div className="border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0 sm:pl-8 flex items-center gap-2">
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-semibold block tracking-wider mb-0.5">Password</span>
                    <span className="font-mono text-yellow-300 font-medium select-all">
                      {showAdminPassword ? currentAdminPassword : '••••••••'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition mt-4"
                    title={showAdminPassword ? 'Hide password' : 'Show password'}
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="sm:pl-4 pt-2 sm:pt-0">
                  <button
                    onClick={handleOpenEditAdminModal}
                    className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-xs font-bold py-2 px-3 rounded-lg shadow transition"
                    title="Edit Admin Credentials"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <Spinner message="Loading user logins..." />
            ) : (
              <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mobile Number</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Gmail / Email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined Date</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {usersList.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-10 text-center text-gray-400 font-medium">
                          <UserCheck className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                          No registered user logins found.
                        </td>
                      </tr>
                    ) : (
                      usersList.map((u, index) => (
                        <tr key={u._id} className="hover:bg-yellow-50/50 transition duration-150">
                          <td className="px-6 py-4 text-sm text-gray-500 font-mono">{index + 1}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-amber-800 font-bold text-sm mr-3">
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-semibold text-gray-900 text-sm">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 font-medium">{u.mobile}</td>
                          <td className="px-6 py-4 text-sm text-gray-700 font-medium">{u.email || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                            <div className="flex items-center gap-2">
                              <span className="select-all">
                                {visibleUserPasswords[u._id] 
                                  ? (u.plainPassword || u.password) 
                                  : '••••••••'
                                }
                              </span>
                              <button
                                type="button"
                                onClick={() => setVisibleUserPasswords(prev => ({
                                  ...prev,
                                  [u._id]: !prev[u._id]
                                }))}
                                className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition"
                                title={visibleUserPasswords[u._id] ? 'Hide Password' : 'Show Password'}
                              >
                                {visibleUserPasswords[u._id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-500">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              onClick={() => handleOpenEditUserModal(u)}
                              className="inline-flex p-2 text-yellow-600 hover:text-amber-800 hover:bg-yellow-50 rounded-lg transition-all"
                              title="Edit User"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="inline-flex p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'footer' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Configure Footer Settings</h1>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 max-w-4xl">
              <p className="text-sm text-gray-500 mb-6">
                Customize the global footer information shown across the storefront. Adjust section descriptions, menu links, and copyright text instantly.
              </p>

              <form onSubmit={handleUpdateFooter} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Brand Description</label>
                  <textarea
                    rows="3"
                    value={footerData.brandDescription}
                    onChange={(e) => setFooterData({ ...footerData, brandDescription: e.target.value })}
                    placeholder="Describe your tech store..."
                    className="w-full p-3 border border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Products Column Links
                    </label>
                    <span className="text-xs text-gray-400 block mb-2">Write one product title per line.</span>
                    <textarea
                      rows="6"
                      value={footerData.products}
                      onChange={(e) => setFooterData({ ...footerData, products: e.target.value })}
                      placeholder="e.g.&#10;Full Stack Gear&#10;3D Printing&#10;IoT Devices"
                      className="w-full p-3 border border-gray-300 rounded-xl font-mono text-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Services Column Links
                    </label>
                    <span className="text-xs text-gray-400 block mb-2">Write one service title per line.</span>
                    <textarea
                      rows="6"
                      value={footerData.services}
                      onChange={(e) => setFooterData({ ...footerData, services: e.target.value })}
                      placeholder="e.g.&#10;Data Recovery&#10;Dev Consulting&#10;Prototyping"
                      className="w-full p-3 border border-gray-300 rounded-xl font-mono text-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Copyright Statement Text</label>
                  <input
                    type="text"
                    value={footerData.copyrightText}
                    onChange={(e) => setFooterData({ ...footerData, copyrightText: e.target.value })}
                    placeholder="Robo Shop. All rights reserved."
                    className="w-full p-3 border border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 outline-none transition"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={footerLoading}
                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-yellow-500/10 active:scale-95 transition-all"
                  >
                    {footerLoading ? 'Saving...' : 'Save Footer Settings'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Modal Overlay */}
        {isUserEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-100 animate-in zoom-in-95 duration-200">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Edit User Details</h2>
              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    required
                    type="text"
                    value={userEditData.name}
                    onChange={(e) => setUserEditData({ ...userEditData, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
                  <input
                    required
                    type="tel"
                    value={userEditData.mobile}
                    onChange={(e) => setUserEditData({ ...userEditData, mobile: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Gmail / Email Address</label>
                  <input
                    required
                    type="email"
                    value={userEditData.email}
                    onChange={(e) => setUserEditData({ ...userEditData, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    New Password <span className="text-xs text-gray-400 font-normal">(Leave blank to keep current)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showUserEditPassword ? 'text' : 'password'}
                      value={userEditData.password}
                      onChange={(e) => setUserEditData({ ...userEditData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowUserEditPassword(!showUserEditPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                      title={showUserEditPassword ? 'Hide password' : 'Show password'}
                    >
                      {showUserEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsUserEditing(false)}
                    className="px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold shadow-md transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Admin Modal Overlay */}
        {isAdminEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-100 animate-in zoom-in-95 duration-200">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Modify Admin Credentials</h2>
              <form onSubmit={handleUpdateAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Admin Email</label>
                  <input
                    required
                    type="email"
                    value={adminEditData.email}
                    onChange={(e) => setAdminEditData({ ...adminEditData, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    New Password <span className="text-xs text-gray-400 font-normal">(Leave blank to keep current)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showAdminEditPassword ? 'text' : 'password'}
                      value={adminEditData.password}
                      onChange={(e) => setAdminEditData({ ...adminEditData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminEditPassword(!showAdminEditPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                      title={showAdminEditPassword ? 'Hide password' : 'Show password'}
                    >
                      {showAdminEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAdminEditing(false)}
                    className="px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold shadow-md transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
