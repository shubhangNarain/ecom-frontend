import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/products';

const NewArrivals = () => {
  const newProducts = PRODUCTS.filter((p) => p.tag === 'New');

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero / Header Section */}
      <section className="pt-32 pb-20 bg-[#0a0a0a] text-white relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-accent/20"
            >
              <Sparkles size={14} /> Just Landed
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display font-bold text-[3.5rem] lg:text-[4.5rem] tracking-tight leading-[1.05] mb-6"
            >
              The Next <br /> <span className="text-accent italic">Generation</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg max-w-xl leading-relaxed"
            >
              Our latest drop features cutting-edge technology and refined design. Explore the future of tech today.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:mb-4"
          >
            <Link to="/shop" className="inline-flex items-center gap-3 bg-accent text-black px-10 py-5 rounded-full font-display font-bold text-sm hover:bg-white transition-all duration-300">
              Browse All Products <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-8">
          <h2 className="font-display font-bold text-2xl text-black">Featured New Arrivals</h2>
          <span className="text-sm text-gray-400">{newProducts.length} items found</span>
        </div>

        <AnimatePresence mode="popLayout">
          {newProducts.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
            >
              {newProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    ease: [0.215, 0.61, 0.355, 1]
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="py-32 text-center text-gray-400">
              <p>New arrivals are currently out of stock. Check back soon!</p>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* Catchy footer-like section for this page */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h3 className="font-display font-bold text-[2.5rem] text-black mb-6 tracking-tight">Stay Ahead of the Curve</h3>
          <p className="text-gray-500 mb-10 leading-7">Join our exclusive tech community and get early access to our most anticipated drops and limited editions.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="w-full sm:w-[320px] bg-white border border-gray-200 rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-accent transition-all"
            />
            <button className="w-full sm:w-auto bg-black text-white px-10 py-4 rounded-full font-display font-bold text-sm hover:bg-accent hover:text-black transition-all">
              Notify Me
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewArrivals;
