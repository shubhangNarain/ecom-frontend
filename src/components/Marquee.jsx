import { motion } from 'framer-motion';

const ITEMS = [
  'Free Shipping Over $99', 'New Arrivals Weekly', 'Premium Audio Gear',
  'Smart Home Devices', '2-Year Warranty', 'Expert Support 24/7',
  'Free Shipping Over $99', 'New Arrivals Weekly', 'Premium Audio Gear',
  'Smart Home Devices', '2-Year Warranty', 'Expert Support 24/7',
];

export default function Marquee() {
  return (
    <div className="bg-black py-5 overflow-hidden">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="flex gap-12 w-max"
      >
        {ITEMS.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 font-display text-[0.8rem] font-semibold tracking-[0.1em] uppercase text-white/50 whitespace-nowrap"
          >
            <span className="text-accent text-xl">✦</span>
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
