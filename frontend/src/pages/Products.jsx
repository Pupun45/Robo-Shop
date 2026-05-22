// src/pages/Products.jsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, AlertCircle, Tag, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { ProductGridSkeleton } from '../components/SkeletonLoader';
import { useProducts } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Products = () => {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [catsLoading, setCatsLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5117';

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setCatsLoading(false);
      }
    };
    fetchCategories();
  }, [apiUrl]);

  // Sidebar tabs: All + dynamic categories from DB + any categories on products not in DB
  const sidebarCategories = useMemo(() => {
    const dbNames = categories.map(c => c.name);
    const productCats = products.map(p => p.category).filter(Boolean);
    const extra = productCats.filter(c => !dbNames.includes(c));
    const unique = [...new Set([...dbNames, ...extra])];
    return ['All', ...unique];
  }, [categories, products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const titleName = (product.title || product.name || '').toLowerCase();
      const desc = (product.description || '').toLowerCase();
      const matchesSearch = titleName.includes(searchTerm.toLowerCase()) || desc.includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory, products]);

  // Count products per category
  const countByCategory = useMemo(() => {
    const map = { All: products.length };
    products.forEach(p => {
      if (p.category) map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
  }, [products]);

  const navigateToDetails = useCallback(
    (id) => navigate(`/products/${id}`),
    [navigate]
  );

  return (
    <section className="py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Our Product Range</h1>
      <p className="text-xl text-gray-500 mb-8">Discover our latest innovations in hardware and development tools.</p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ─── Left Sidebar: Category Tabs ─── */}
        <aside className="w-full lg:w-60 flex-shrink-0">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2.5 pl-9 pr-3 rounded-xl border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition text-sm shadow-sm"
            />
          </div>

          {/* Category Sidebar - Desktop */}
          <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-900" />
              <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">Categories</span>
            </div>
            {catsLoading ? (
              <Spinner size="small" message="" className="py-6" />
            ) : (
              <ul className="divide-y divide-gray-100">
                {sidebarCategories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  const count = countByCategory[cat] || 0;
                  return (
                    <li key={cat}>
                      <button
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all duration-200 group ${
                          isActive
                            ? 'bg-yellow-50/50 text-amber-700 border-l-4 border-yellow-500 font-bold'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-amber-700 border-l-4 border-transparent'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${isActive ? 'text-amber-700 rotate-90' : 'text-gray-400 group-hover:text-amber-500'}`}
                          />
                          {cat}
                        </span>
                        <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${
                          isActive ? 'bg-yellow-400 text-gray-900' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Category Horizontal Pills - Mobile/Tablet */}
          <div className="lg:hidden">
            {catsLoading ? (
              <Spinner size="small" message="" className="py-2" />
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-3 pt-1 -mx-4 px-4 scrollbar-none scroll-smooth">
                {sidebarCategories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  const count = countByCategory[cat] || 0;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                        isActive
                          ? 'bg-yellow-400 text-gray-900 shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                      <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.2 ${
                        isActive ? 'bg-yellow-500 text-gray-900' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* ─── Right: Products Grid ─── */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-semibold text-gray-800">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''}
                  {selectedCategory !== 'All' && <> in <span className="font-semibold text-amber-700">"{selectedCategory}"</span></>}
                </p>
                {(searchTerm || selectedCategory !== 'All') && (
                  <button
                    onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                    className="text-xs text-red-500 hover:text-red-700 font-medium underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} navigateToDetails={navigateToDetails} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-xl shadow-inner">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
              <p className="text-xl font-semibold text-gray-700">No products found.</p>
              <p className="text-gray-500 mt-2">Try adjusting your search or filter settings.</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                className="mt-4 text-yellow-600 hover:underline font-medium text-sm"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Products;
