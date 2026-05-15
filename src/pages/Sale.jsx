import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Timer, Percent, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/products';

const Sale = () => {
  const saleProducts = PRODUCTS.filter((p) => p.tag === 'Sale');

  return (
    <div className="min-h-screen bg-white">
      
      {/* Dynamic Sale Banner */}
      <section className="pt-32 pb-20 bg-accent text-black relative overflow-hidden">
        {/* Animated stripes background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 rotate-12 scale-150 flex flex-col gap-8">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-black w-full" />
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 bg-black text-accent px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
              >
                <Percent size={14} /> Seasonal Offers
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display font-bold text-[4rem] lg:text-[6rem] tracking-tighter leading-[0.9] mb-6 uppercase italic"
              >
                Flash <br /> <span className="text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">Savings</span>
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center lg:justify-start gap-6 text-black/70 font-display font-bold uppercase tracking-widest text-sm"
              >
                <span className="flex items-center gap-2"><Timer size={16} /> Limited Time</span>
                <span className="flex items-center gap-2"><Tag size={16} /> Up to 40% Off</span>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, rotate: -5, scale: 0.9 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="bg-black text-white p-12 rounded-3xl shadow-2xl relative"
            >
              <div className="absolute -top-4 -right-4 bg-white text-black w-16 h-16 rounded-full flex items-center justify-center font-display font-black text-xl border-4 border-black">
                -40%
              </div>
              <p className="font-display font-bold text-2xl mb-2 italic text-accent">Cyber Week</p>
              <h2 className="font-display font-black text-5xl mb-6 tracking-tight">THE TECH <br /> EVENT</h2>
              <Link to="/shop" className="inline-flex items-center gap-2 bg-accent text-black px-8 py-4 rounded-full font-display font-bold text-sm hover:bg-white transition-all">
                Shop Everything <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-8">
          <div className="flex items-center gap-4">
            <h2 className="font-display font-bold text-2xl text-black">Sale Items</h2>
            <div className="bg-accent text-black text-[0.6rem] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
              {saleProducts.length} Deals
            </div>
          </div>
          <div className="hidden md:flex gap-4">
             {/* Filter placeholders if needed */}
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          {saleProducts.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
            >
              {saleProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.08
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="py-32 text-center text-gray-400">
              <p>No sale items available at the moment. Sign up for notifications!</p>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* Urgency Section */}
      <section className="py-24 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <motion.div 
            whileInView={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-block mb-6"
          >
            <Timer size={48} className="text-accent fill-black" />
          </motion.div>
          <h3 className="font-display font-bold text-4xl text-black mb-6">Don't Miss Out</h3>
          <p className="text-gray-500 mb-10 text-lg">These deals are refreshed every 24 hours. Grab your favorites before they're gone for good.</p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/new-arrivals" className="text-black font-display font-bold border-b-2 border-black hover:text-accent hover:border-accent transition-all pb-1">
              View New Arrivals
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sale;
