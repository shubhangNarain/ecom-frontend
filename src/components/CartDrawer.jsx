import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeItem, updateQuantity, cartTotal, cartCount } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] cursor-none"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-[450px] bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-8 py-8 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingBag size={24} className="text-black" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-[0.6rem] font-bold flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </div>
                <h2 className="font-display font-bold text-xl uppercase tracking-widest">Your Bag</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-black hover:text-white transition-all group"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <ShoppingBag size={64} className="mb-6" />
                  <p className="font-display font-medium text-lg mb-8 uppercase tracking-widest">Bag is Empty</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-xs font-bold border-b-2 border-black pb-1 hover:text-accent hover:border-accent transition-colors"
                  >
                    START SHOPPING
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {cart.map((item) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={item.id} 
                      className="flex gap-6 group"
                    >
                      <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-display font-bold text-sm uppercase tracking-tight line-clamp-1">{item.name}</h3>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">{item.category}</p>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center gap-4 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="font-display font-bold text-xs w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <p className="font-display font-bold text-sm">${(parseFloat(item.price.replace(',', '')) * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-8 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest mb-1">Subtotal</p>
                    <p className="text-[0.6rem] text-gray-400">Shipping & taxes calculated at checkout</p>
                  </div>
                  <p className="font-display font-black text-3xl text-black">${cartTotal.toLocaleString()}</p>
                </div>
                <button className="w-full bg-black text-white py-5 rounded-2xl font-display font-bold text-sm uppercase tracking-[0.2em] hover:bg-accent hover:text-black transition-all flex items-center justify-center gap-3 group">
                  Proceed to Checkout
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
