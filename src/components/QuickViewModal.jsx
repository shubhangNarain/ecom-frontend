import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { ShoppingCart, Eye, Star, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function QuickViewModal({ product, open, setOpen }) {
  const { addItem } = useCart();
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none shadow-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Image Container */}
          <div className="bg-gray-50 p-8 flex items-center justify-center relative">
            {product.tag && (
              <span className="absolute top-6 left-6 bg-black text-accent font-display text-[0.65rem] font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full z-10 shadow-lg">
                {product.tag}
              </span>
            )}
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              src={product.image}
              alt={product.name}
              className="w-full h-auto max-h-[340px] object-contain drop-shadow-2xl"
            />
          </div>

          {/* Right: Content */}
          <div className="p-8 lg:p-10 flex flex-col justify-center bg-white">
            <DialogHeader className="mb-6">
              <div className="flex items-center gap-2 text-accent text-[0.65rem] font-bold uppercase tracking-[0.15em] mb-2">
                <Zap size={12} fill="currentColor" />
                {product.category}
              </div>
              <DialogTitle className="font-display font-bold text-3xl text-black leading-tight mb-2 tracking-tight">
                {product.name}
              </DialogTitle>
              <div className="flex items-center gap-4 mt-4">
                <span className="font-display text-2xl font-bold text-black">${product.price}</span>
                {product.oldPrice && (
                  <span className="text-lg text-gray-400 line-through">${product.oldPrice}</span>
                )}
              </div>
            </DialogHeader>

            <DialogDescription className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3">
              {product.description || "Experience the next level of technology with our flagship design. Engineered for performance and crafted for elegance."}
            </DialogDescription>

            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3 text-[0.7rem] font-bold text-gray-400 uppercase tracking-widest">
                <ShieldCheck size={16} className="text-accent" />
                2 Year Global Warranty
              </div>
              <div className="flex items-center gap-3 text-[0.7rem] font-bold text-gray-400 uppercase tracking-widest">
                <Star size={16} className="text-accent fill-accent" />
                4.9/5 Average Rating
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => addItem(product)}
                className="w-full bg-black text-white py-4 rounded-xl font-display font-bold text-xs uppercase tracking-widest hover:bg-accent hover:text-black transition-all flex items-center justify-center gap-2 group"
              >
                <ShoppingCart size={16} className="group-hover:scale-110 transition-transform" />
                Add to Cart
              </button>
              <Link 
                to={`/product/${product.id}`}
                onClick={() => setOpen(false)}
                className="w-full bg-gray-50 text-black py-4 rounded-xl font-display font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2 border border-gray-100"
              >
                View Full Details
                <Eye size={16} />
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Utility icon for the header (was missing Zap)
function Zap({ size, fill, className }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={fill || "none"} 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
