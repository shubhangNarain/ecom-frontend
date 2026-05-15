import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import QuickViewModal from './QuickViewModal';

export default function ProductCard({ product }) {
  const [wished, setWished] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ y: -6, boxShadow: '0 8px 40px rgba(0,0,0,0.14)' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-gray-50 rounded-2xl overflow-hidden cursor-none relative group"
      >
        {/* Top-Right Quick Action (Eye) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowQuickView(true);
          }}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent hover:text-black shadow-sm translate-y-[-10px] group-hover:translate-y-0"
          aria-label="Quick View"
        >
          <Eye size={16} />
        </button>

        {/* Image area */}
        <Link to={`/product/${product.id}`} className="relative bg-white p-8 h-[240px] flex items-center justify-center overflow-hidden block">
          {product.tag && (
            <span className="absolute top-4 left-4 bg-accent text-black font-display text-[0.68rem] font-bold tracking-wide px-3 py-1 rounded-full z-10">
              {product.tag}
            </span>
          )}

          <motion.img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-[180px] w-auto object-contain"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.35 }}
          />

          {/* Minimal hover overlay (just a subtle tint now) */}
          <div className="absolute inset-0 bg-black/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Info */}
        <div className="px-6 pb-6 pt-5">
          <div className="text-[0.72rem] font-medium text-gray-500 tracking-wide uppercase mb-1">
            {product.category}
          </div>
          <Link to={`/product/${product.id}`} className="font-display font-semibold text-black hover:text-accent transition-colors leading-snug mb-4 block">
            {product.name}
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-display text-[1.2rem] font-bold text-black">
                ${product.price}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-gray-400 line-through ml-2">
                  ${product.oldPrice}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setWished(!wished);
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${wished ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400 hover:text-black'}`}
              >
                <Heart size={16} fill={wished ? 'currentColor' : 'none'} />
              </button>
              <motion.button
                whileHover={{ backgroundColor: '#c6f135', color: '#000' }}
                transition={{ duration: 0.2 }}
                className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white"
                aria-label="Add to cart"
              >
                <ShoppingCart size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <QuickViewModal 
        product={product} 
        open={showQuickView} 
        setOpen={setShowQuickView} 
      />
    </>
  );
}
