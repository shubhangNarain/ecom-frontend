import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, ChevronDown, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Featured');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const { products, loading, error } = useProducts();

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  const getCategoryCount = (cat) => {
    if (cat === 'All') return products.length;
    return products.filter((p) => p.category === cat).length;
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Basic sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Price: Low to High')
      return (
        parseFloat(a.price.replace(',', '')) -
        parseFloat(b.price.replace(',', ''))
      );
    if (sortBy === 'Price: High to Low')
      return (
        parseFloat(b.price.replace(',', '')) -
        parseFloat(a.price.replace(',', ''))
      );
    return 0; // Featured
  });

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-8">
        {/* Page Header */}
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-4"
          >
            Explore Tech
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-bold text-[3.5rem] tracking-tight text-black leading-none mb-6"
          >
            Our Shop
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="h-1 w-20 bg-accent rounded-full"
          />
        </div>

        {/* Main Grid Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          
          {/* Desktop Sidebar (lg:block, hidden on mobile) */}
          <aside className="hidden lg:block lg:col-span-1 sticky top-32 space-y-8 bg-gray-50/50 p-8 rounded-3xl border border-gray-100/80">
            {/* Search */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-xs tracking-wider text-black uppercase">Search</h3>
              <div className="relative group">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-11 pr-10 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-xs tracking-wider text-black uppercase">Categories</h3>
                {activeCategory !== 'All' && (
                  <button
                    onClick={() => setActiveCategory('All')}
                    className="text-xs text-gray-400 hover:text-black font-semibold transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  const count = getCategoryCount(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl font-display text-sm font-semibold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-black text-white shadow-lg shadow-black/10'
                          : 'text-gray-600 hover:text-black hover:bg-gray-100/80'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-[0.7rem] font-bold px-2 py-0.5 rounded-md ${
                        isActive ? 'bg-accent text-black' : 'bg-gray-200/60 text-gray-500'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort Options */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-xs tracking-wider text-black uppercase">Sort By</h3>
              <div className="flex flex-col gap-2">
                {['Featured', 'Price: Low to High', 'Price: High to Low'].map((option) => {
                  const isSelected = sortBy === option;
                  return (
                    <button
                      key={option}
                      onClick={() => setSortBy(option)}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl font-display text-sm font-semibold transition-all duration-200 text-left cursor-pointer border ${
                        isSelected
                          ? 'border-black bg-black/5 text-black font-bold'
                          : 'border-transparent text-gray-600 hover:text-black hover:bg-gray-100/80'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all ${
                        isSelected ? 'border-black bg-black' : 'border-gray-300'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
                      </div>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right Column (Product Grid & Mobile Controls) */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Mobile filter bar (lg:hidden) */}
            <div className="lg:hidden flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between pb-6 border-b border-gray-100">
              <div className="relative flex-1 group">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-11 pr-10 text-sm focus:ring-2 focus:ring-accent outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-display font-bold text-sm border-2 transition-all cursor-pointer ${
                    isMobileFiltersOpen || activeCategory !== 'All'
                      ? 'bg-black border-black text-white'
                      : 'border-gray-100 hover:border-black text-black'
                  }`}
                >
                  <Filter size={16} />
                  <span>Filters</span>
                  {activeCategory !== 'All' && (
                    <span className="bg-accent text-black text-[0.7rem] font-bold px-2 py-0.5 rounded-full ml-1">
                      1
                    </span>
                  )}
                </button>

                <div className="relative flex-1 sm:flex-none">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border-none rounded-2xl py-3.5 pl-5 pr-10 text-sm font-semibold focus:ring-2 focus:ring-accent outline-none transition-all cursor-pointer"
                  >
                    <option>Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
            </div>

            {/* Mobile collapsible filter panel */}
            <AnimatePresence>
              {isMobileFiltersOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="lg:hidden overflow-hidden bg-gray-50 rounded-2xl border border-gray-100 p-6 space-y-6"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-display font-bold text-xs uppercase tracking-wider text-gray-400">Select Category</span>
                      {activeCategory !== 'All' && (
                        <button
                          onClick={() => setActiveCategory('All')}
                          className="text-xs text-black font-semibold border-b border-accent"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => {
                        const isActive = activeCategory === cat;
                        const count = getCategoryCount(cat);
                        return (
                          <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-sm font-semibold transition-all duration-200 cursor-pointer ${
                              isActive
                                ? 'bg-black text-white shadow-md'
                                : 'bg-white border border-gray-200 text-gray-600 hover:border-black'
                            }`}
                          >
                            <span>{cat}</span>
                            <span className={`text-[0.65rem] font-bold px-1.5 py-0.5 rounded ${
                              isActive ? 'bg-accent text-black' : 'bg-gray-100 text-gray-400'
                            }`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Product Count & Info Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Showing</span>
                <span className="font-display font-bold text-black text-lg">
                  {sortedProducts.length}
                </span>
                <span className="text-sm text-gray-400">products</span>
              </div>
              {(activeCategory !== 'All' || searchQuery) && (
                <button
                  onClick={() => {
                    setActiveCategory('All');
                    setSearchQuery('');
                  }}
                  className="text-xs text-gray-500 hover:text-black font-semibold border-b-2 border-accent hover:border-black transition-all cursor-pointer pb-0.5"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Loading and Error States */}
            {loading && (
              <div className="py-32 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-accent rounded-full animate-spin mb-4"></div>
                <p className="font-display font-bold text-gray-500">
                  Loading products...
                </p>
              </div>
            )}

            {error && (
              <div className="py-32 flex flex-col items-center justify-center text-center">
                <div className="text-5xl mb-4">⚠️</div>
                <p className="font-display font-bold text-xl text-red-500 mb-2">
                  Failed to load products
                </p>
                <p className="text-gray-500">Please try refreshing the page.</p>
              </div>
            )}

            {/* Product Grid */}
            {!loading && !error && (
              <AnimatePresence mode="popLayout">
                {sortedProducts.length > 0 ? (
                  <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                  >
                    {sortedProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.05,
                          layout: { duration: 0.3 },
                        }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-32 text-center"
                  >
                    <div className="text-6xl mb-6">🏜️</div>
                    <h3 className="font-display text-2xl font-bold mb-2">
                      No matching products
                    </h3>
                    <p className="text-gray-400">
                      Try adjusting your filters or search terms.
                    </p>
                    <button
                      onClick={() => {
                        setActiveCategory('All');
                        setSearchQuery('');
                      }}
                      className="mt-8 text-black font-display font-bold border-b-2 border-accent hover:border-black transition-all"
                    >
                      Clear all filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;

