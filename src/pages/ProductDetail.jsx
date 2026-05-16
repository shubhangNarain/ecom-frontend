import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, ArrowLeft, Shield, Zap, Truck, RotateCcw } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { addItem } = useCart();
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === parseInt(id));

  // Find related products (same category, excluding current)
  const related = PRODUCTS.filter((p) => p.category === product?.category && p.id !== product?.id).slice(0, 4);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <h2 className="font-display font-bold text-3xl mb-4">Product Not Found</h2>
        <Link to="/shop" className="text-accent underline">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-8">
        {/* Back Button */}
        <Link 
          to="/shop" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-12 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-display font-medium text-sm">Back to Shop</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left: Product Image (Sticky) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-40 bg-gray-50 rounded-3xl p-12 flex items-center justify-center overflow-hidden"
          >
            {product.tag && (
              <span className="absolute top-8 left-8 bg-black text-accent font-display text-[0.7rem] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full z-10">
                {product.tag}
              </span>
            )}
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-auto max-h-[500px] object-contain hover:scale-105 transition-transform duration-500"
            />
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="mb-8">
              <p className="text-accent text-[0.7rem] font-bold tracking-[0.2em] uppercase mb-3">
                {product.category}
              </p>
              <h1 className="font-display font-bold text-4xl lg:text-5xl text-black tracking-tight mb-6">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="font-display text-3xl font-bold text-black">${product.price}</span>
                {product.oldPrice && (
                  <span className="text-xl text-gray-400 line-through">${product.oldPrice}</span>
                )}
              </div>
            </div>

            <p className="text-gray-500 text-lg leading-relaxed mb-10 pb-10 border-b border-gray-100">
              {product.description}
            </p>

            {/* Actions */}
            <div className="flex gap-4 mb-12">
              <button 
                onClick={() => addItem(product)}
                className="flex-1 bg-black text-white py-5 rounded-2xl font-display font-bold text-sm uppercase tracking-widest hover:bg-accent hover:text-black transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
              <button className="w-16 h-16 border-2 border-gray-100 rounded-2xl flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all">
                <Heart size={20} />
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {product.features?.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-accent shadow-sm">
                    <Zap size={14} fill="currentColor" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* Specs Accordion-style (Simplified) */}
            <div className="bg-gray-50 rounded-2xl p-8 mb-12">
              <h3 className="font-display font-bold text-black text-xs uppercase tracking-widest mb-6">Technical Specifications</h3>
              <div className="space-y-4">
                {Object.entries(product.specs || {}).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0">
                    <span className="text-sm text-gray-500">{key}</span>
                    <span className="text-sm font-bold text-black">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-8 border-t border-gray-100">
              <div className="flex flex-col items-center text-center gap-2">
                <Shield size={18} className="text-gray-400" />
                <span className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-tighter">2 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Truck size={18} className="text-gray-400" />
                <span className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-tighter">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw size={18} className="text-gray-400" />
                <span className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-tighter">30-Day Returns</span>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-32">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-2">Complete the look</p>
                <h2 className="font-display font-bold text-3xl text-black">Related Products</h2>
              </div>
              <Link to="/shop" className="text-sm font-bold border-b-2 border-accent pb-1">View All</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
