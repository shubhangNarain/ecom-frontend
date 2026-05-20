import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToBag = (product) => {
    addItem(product);
    removeFromWishlist(product.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-8">
        
        <h1 className="font-display font-bold text-4xl text-black tracking-tight mb-12 uppercase tracking-wider">
          Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <Heart className="text-gray-200 mb-6 animate-pulse" size={64} fill="currentColor" />
            <h3 className="font-display font-bold text-xl uppercase tracking-widest text-black mb-2">
              Your Wishlist is Empty
            </h3>
            <p className="text-gray-400 text-sm mb-8 max-w-sm leading-relaxed">
              Save your favorite items here to purchase later. Keep track of what you love!
            </p>
            <Link
              to="/shop"
              className="bg-black text-white px-8 py-4.5 rounded-2xl font-display font-bold text-xs uppercase tracking-[0.2em] hover:bg-accent hover:text-black transition-all flex items-center gap-2 group"
            >
              Browse Shop <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {wishlist.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow relative"
                >
                  
                  {/* Delete button absolutely positioned top-right */}
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm"
                    aria-label="Remove from Wishlist"
                  >
                    <Trash2 size={14} />
                  </button>

                  <Link to={`/product/${product.id}`} className="p-6 h-[200px] flex items-center justify-center bg-white overflow-hidden border-b border-gray-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-[140px] w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                        {product.category}
                      </span>
                      <Link to={`/product/${product.id}`} className="font-display font-semibold text-xs text-black uppercase tracking-tight line-clamp-2 hover:text-accent transition-colors leading-tight">
                        {product.name}
                      </Link>
                    </div>

                    <div>
                      <p className="font-display font-black text-sm text-black mb-3">
                        ${product.price}
                      </p>

                      <button
                        onClick={() => handleMoveToBag(product)}
                        className="w-full bg-black text-white hover:bg-accent hover:text-black py-3 rounded-xl font-display font-bold text-[10px] uppercase tracking-[0.12em] transition-all flex items-center justify-center gap-2 active:scale-98"
                      >
                        <ShoppingCart size={12} /> Add to Bag
                      </button>
                    </div>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
}
