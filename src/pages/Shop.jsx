import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';

const CATEGORIES = [
  'All',
  'Audio',
  'Wearables',
  'Computers',
  'Photography',
  'Gaming',
];

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Featured');
  const { products, loading, error } = useProducts();

  const categories = [...new Set(products.map((p) => p.category))];

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
        <div className="mb-16">
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

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 border-b border-gray-100 pb-8">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full font-display text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group min-w-[280px]">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 border-none rounded-full py-3 pl-12 pr-6 text-sm focus:ring-2 focus:ring-accent outline-none transition-all"
              />
            </div>

            <div className="relative group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border-2 border-gray-100 rounded-full py-3 pl-6 pr-12 text-sm font-semibold focus:border-black outline-none transition-all cursor-pointer"
              >
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
              <ChevronDown
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={16}
              />
            </div>
          </div>
        </div>

        {/* Product Count */}
        <div className="mb-8 flex items-center gap-2">
          <span className="text-sm text-gray-400">Showing</span>
          <span className="font-display font-bold text-black">
            {sortedProducts.length}
          </span>
          <span className="text-sm text-gray-400">products</span>
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
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
  );
};

export default Shop;
