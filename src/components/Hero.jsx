import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-110px)] overflow-hidden">

      {/* ── Left: content ── */}
      <motion.div
        className="bg-gray-50 flex flex-col justify-center px-10 py-20 lg:px-24"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
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
          Next-Gen<br />
          <span className="[-webkit-text-stroke:2px_#0a0a0a] text-transparent">Audio</span><br />
          Redefined
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="text-gray-500 text-base leading-7 max-w-md mb-10"
        >
          Experience sound like never before. Premium speakers, headphones, and smart devices
          engineered for those who demand the best.
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
          {[['500+', 'Products'], ['98%', 'Satisfaction'], ['50K+', 'Customers']].map(([num, label]) => (
            <div key={label}>
              <div className="font-display text-[1.8rem] font-bold text-black leading-none">{num}</div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Right: product image ── */}
      <div className="bg-black relative flex items-center justify-center min-h-[400px] lg:min-h-auto overflow-hidden">
        {/* Radial glow */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(198,241,53,0.15)_0%,transparent_70%)]" />

        {/* Floating product image */}
        <motion.img
          src="/hero_speaker.png"
          alt="AURA Smart Speaker"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[85%] max-w-[460px] relative z-10 drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
        />

        {/* Best seller badge */}
        <div className="absolute bottom-10 right-10 bg-accent text-black font-display font-bold text-sm px-5 py-3 rounded-xl z-20 leading-snug">
          🔥 Best Seller<br />
          <span className="text-[0.7rem] font-normal">AURA Smart Speaker</span>
        </div>
      </div>
    </section>
  );
}
