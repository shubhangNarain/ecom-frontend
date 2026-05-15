import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const PROMOS = [
  { id: 1, label: 'Limited Time',  title: 'Up to 40% Off\nAudio Gear',            bg: '#111', imgSrc: '/product_headphones.png' },
  { id: 2, label: 'New Arrivals',  title: 'Smart Devices\nFor Every Lifestyle',   bg: '#1a1a2e', imgSrc: '/product_smartwatch.png' },
];

export default function PromoBanners() {
  return (
    <section className="pb-24">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROMOS.map((promo) => (
            <motion.div
              key={promo.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="relative rounded-3xl overflow-hidden min-h-[360px] flex flex-col justify-end p-10 cursor-pointer"
              style={{ background: promo.bg }}
            >
              {/* Background product image */}
              <img
                src={promo.imgSrc}
                alt={promo.title}
                className="absolute inset-0 w-full h-full object-contain object-center opacity-30 scale-90"
              />

              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

              {/* Content */}
              <div className="relative z-10 text-white">
                <div className="text-accent text-[0.72rem] font-semibold tracking-[0.15em] uppercase mb-2">
                  {promo.label}
                </div>
                <div className="font-display font-bold leading-tight mb-5" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
                  {promo.title.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
                </div>
                <a
                  href="#products"
                  className="inline-flex items-center gap-2 font-display font-semibold text-sm text-white border-b-2 border-accent pb-0.5 hover:text-accent transition-colors"
                >
                  Shop Now <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
