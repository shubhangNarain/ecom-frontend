import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Eye } from 'lucide-react';

export default function ProductCard({ product }) {
  const [wished, setWished] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 8px 40px rgba(0,0,0,0.14)' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-gray-50 rounded-2xl overflow-hidden cursor-pointer"
    >
      {/* Image area */}
      <div className="relative bg-white p-8 h-[240px] flex items-center justify-center overflow-hidden group">
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

        {/* Hover actions */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <button
            onClick={() => setWished(!wished)}
            aria-label="Wishlist"
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-accent transition-colors"
          >
            <Heart
              size={15}
              fill={wished ? '#c6f135' : 'none'}
              color={wished ? '#c6f135' : 'currentColor'}
            />
          </button>
          <button
            aria-label="Quick View"
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-accent transition-colors"
          >
            <Eye size={15} />
          </button>
        </motion.div>
      </div>

      {/* Info */}
      <div className="px-6 pb-6 pt-5">
        <div className="text-[0.72rem] font-medium text-gray-500 tracking-wide uppercase mb-1">
          {product.category}
        </div>
        <div className="font-display font-semibold text-black leading-snug mb-4">
          {product.name}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-display text-[1.2rem] font-bold text-black">${product.price}</span>
            {product.oldPrice && (
              <span className="text-sm text-gray-400 line-through ml-2">${product.oldPrice}</span>
            )}
          </div>
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
    </motion.div>
  );
}
