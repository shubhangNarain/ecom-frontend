import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, ArrowRight, Filter, SlidersHorizontal } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { products, loading, error } = useProducts();

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q)
    );
  }, [query]);

  // Suggested products if no results found
  const suggestions = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Header Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 text-gray-400 mb-6">
            <Link to="/" className="text-[0.7rem] font-semibold tracking-widest uppercase hover:text-black transition-colors">Home</Link>
            <span className="text-[0.6rem]">/</span>
            <span className="text-[0.7rem] font-semibold tracking-widest uppercase text-black">Search Results</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="font-display font-bold tracking-tight text-black mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1 }}>
                {query ? (
                  <>Results for <span className="text-accent">&ldquo;{query}&rdquo;</span></>
                ) : (
                  'Search our store'
                )}
              </h1>
              <p className="text-gray-500 font-medium italic">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </p>
            </div>

            {filteredProducts.length > 0 && (
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-6 py-3 border border-gray-100 rounded-full font-display font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
                  <Filter size={14} /> Filter
                </button>
                <button className="flex items-center gap-2 px-6 py-3 border border-gray-100 rounded-full font-display font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
                  <SlidersHorizontal size={14} /> Sort
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Grid */}
        <div className="relative">
          {loading && (
            <div className="py-32 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-accent rounded-full animate-spin mb-4"></div>
              <p className="font-display font-bold text-gray-500">Searching...</p>
            </div>
          )}

          {error && (
            <div className="py-32 flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <p className="font-display font-bold text-xl text-red-500 mb-2">Error searching products</p>
              <p className="text-gray-500">Please try again later.</p>
            </div>
          )}

          {!loading && !error && (
            filteredProducts.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="py-20 flex flex-col items-center text-center max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 relative">
                <SearchIcon size={32} className="text-gray-300" />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute inset-0 rounded-full border-2 border-accent/20"
                />
              </div>
              
              <h2 className="font-display font-bold text-2xl text-black mb-4">
                No results for &ldquo;{query}&rdquo;
              </h2>
              <p className="text-gray-500 mb-10 leading-relaxed">
                We couldn't find any products matching your search. Try checking for typos or using more general keywords.
              </p>

              <div className="w-full bg-gray-50/50 rounded-3xl p-12">
                <h3 className="font-display font-bold text-lg text-black mb-8">Popular Suggestions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {suggestions.map((product) => (
                    <Link 
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="group flex items-center gap-4 bg-white p-4 rounded-2xl hover:shadow-xl hover:shadow-black/5 transition-all duration-500"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="text-left">
                        <p className="font-display font-bold text-sm text-black group-hover:text-accent transition-colors">{product.name}</p>
                        <p className="text-xs text-gray-400 font-medium">{product.category} • ${product.price}</p>
                      </div>
                      <ArrowRight size={14} className="ml-auto text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
