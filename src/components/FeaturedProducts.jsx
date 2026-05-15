import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { PRODUCTS } from '../data/products';

export default function FeaturedProducts({ searchQuery = '' }) {
  const q = searchQuery.trim().toLowerCase();
  const filtered = q
    ? PRODUCTS.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    : PRODUCTS;

  return (
    <section className="py-24" id="products">
      <div className="max-w-7xl mx-auto px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-2">
              Our Collection
            </p>
            <h2 className="font-display font-bold tracking-tight text-black" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.1 }}>
              {q ? (
                <>Results for <span className="text-accent">&ldquo;{searchQuery}&rdquo;</span></>
              ) : (
                'Featured Products'
              )}
            </h2>
          </div>
          {!q && (
            <Link to="/shop" className="inline-flex items-center gap-2 bg-transparent text-black font-display font-semibold text-sm px-7 py-3.5 rounded-full border-2 border-black hover:bg-black hover:text-white transition-all duration-300 shrink-0">
              View All <ArrowRight size={15} />
            </Link>
          )}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="text-5xl mb-4 opacity-30">🔍</div>
            <p className="font-display text-[1.4rem] font-bold text-black mb-2">No products found</p>
            <p className="text-gray-400 text-sm leading-7">
              We couldn&rsquo;t find anything matching &ldquo;{searchQuery}&rdquo;.<br />Try a different keyword.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
