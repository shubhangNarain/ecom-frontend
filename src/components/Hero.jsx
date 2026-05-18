import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Play } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-110px)] overflow-hidden">
      {/* ── Left: content ── */}
      <motion.div
        className="bg-gray-50 flex flex-col justify-center px-10 py-20 lg:px-24"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {/* Label */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-black text-accent font-display text-[0.7rem] font-semibold tracking-[0.15em] uppercase px-4 py-1.5 rounded-full mb-6 self-start"
        >
          <Zap size={12} fill="currentColor" />
          New Collection 2025
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.55 }}
          className="font-display font-bold leading-none tracking-tight text-black mb-6"
          style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}
        >
          Next-Gen
          <br />
          <span className="[-webkit-text-stroke:2px_#0a0a0a] text-transparent">
            Audio
          </span>
          <br />
          Redefined
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="text-gray-500 text-base leading-7 max-w-md mb-10"
        >
          Experience sound like never before. Premium speakers, headphones, and
          smart devices engineered for those who demand the best.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 flex-wrap"
        >
          <a
            href="#products"
            className="inline-flex items-center gap-2 bg-accent text-black font-display font-semibold text-sm tracking-wide px-7 py-3.5 rounded-full hover:bg-accent-dk hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(198,241,53,0.4)] transition-all duration-300"
          >
            Shop Now <ArrowRight size={15} />
          </a>
          <a
            href="#features"
            className="inline-flex items-center gap-2 bg-transparent text-black font-display font-semibold text-sm tracking-wide px-7 py-3.5 rounded-full border-2 border-black hover:bg-black hover:text-white hover:-translate-y-0.5 transition-all duration-300"
          >
            Explore Tech
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="flex gap-10 mt-12 pt-8 border-t border-gray-200"
        >
          {[
            ['500+', 'Products'],
            ['98%', 'Satisfaction'],
            ['50K+', 'Customers'],
          ].map(([num, label]) => (
            <div key={label}>
              <div className="font-display text-[1.8rem] font-bold text-black leading-none">
                {num}
              </div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Right: Image Card Layout ── */}
      <div className="bg-gray-50 relative min-h-[500px] lg:min-h-[calc(100vh-110px)] overflow-hidden flex items-center justify-center p-10">
        {/* Radial glow behind the card */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(198,241,53,0.15)_0%,transparent_60%)]" />
        </div>

        {/* Main Aesthetic Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="relative z-10 w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] group"
        >
          <img 
            src="/hero_headphones.png" 
            alt="Premium Headphones" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            fetchPriority="high"
          />
          
          {/* Glassmorphism overlay info */}
          <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl text-white overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/40 before:to-transparent before:-z-10">
            <div className="flex justify-between items-center mb-2">
              <span className="font-display font-bold tracking-widest text-[0.65rem] uppercase text-accent">Featured</span>
              <div className="w-8 h-8 rounded-full bg-accent text-black flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg shadow-accent/20">
                <Play size={12} fill="currentColor" />
              </div>
            </div>
            <h3 className="font-display font-bold text-xl drop-shadow-md">SPEKTR Pro</h3>
            <p className="text-white/90 text-xs font-medium mt-1 drop-shadow-md">Studio-grade acoustic isolation</p>
          </div>
        </motion.div>

        {/* Floating decoration cards */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
          className="absolute right-10 top-1/4 bg-white p-4 rounded-2xl shadow-xl z-20 hidden md:block border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-black font-bold shadow-inner">
              <Zap size={18} fill="currentColor" />
            </div>
            <div className="pr-2">
              <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest mb-1">Battery Life</p>
              <p className="font-display font-bold text-black leading-none text-lg">40 Hours</p>
            </div>
          </div>
        </motion.div>

        {/* Best seller badge */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
          className="absolute bottom-10 right-10 lg:bottom-20 bg-black text-white font-display font-bold text-sm px-6 py-4 rounded-2xl z-20 shadow-2xl"
        >
          <span className="text-accent">🔥</span> Top Rated
          <br />
          <span className="text-[0.7rem] font-normal text-gray-300">Over 5k reviews</span>
        </motion.div>
      </div>
    </section>
  );
}
