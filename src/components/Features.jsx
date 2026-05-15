import { motion } from 'framer-motion';
import { Truck, Shield, RotateCcw, Headphones, Zap, Award } from 'lucide-react';

const FEATURES = [
  { icon: <Truck size={22} />,      title: 'Free Shipping',    desc: 'Free standard shipping on all orders over $99. Express delivery available at checkout.' },
  { icon: <Shield size={22} />,     title: '2-Year Warranty',  desc: 'Every product comes with our comprehensive 2-year manufacturer warranty for peace of mind.' },
  { icon: <RotateCcw size={22} />,  title: '30-Day Returns',   desc: 'Not satisfied? Return any item within 30 days for a full refund — no questions asked.' },
  { icon: <Headphones size={22} />, title: '24/7 Support',     desc: 'Our expert team is available around the clock to help you with any questions.' },
  { icon: <Zap size={22} />,        title: 'Fast Charging',    desc: 'Our devices support the latest fast-charging standards. From 0 to 80% in under 30 min.' },
  { icon: <Award size={22} />,      title: 'Premium Quality',  desc: 'We source only the best electronics, tested and certified to meet the highest standards.' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Features() {
  return (
    <section className="bg-black py-24" id="features">
      <div className="max-w-7xl mx-auto px-8">
        <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-accent mb-3">
          Why Choose Us
        </p>
        <h2 className="font-display font-bold tracking-tight text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.1 }}>
          Built for Those<br />Who Demand More
        </h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              variants={cardVariant}
              whileHover={{ borderColor: '#c6f135', y: -4 }}
              transition={{ duration: 0.25 }}
              className="bg-dark2 rounded-2xl p-8 border border-white/5"
            >
              <div className="w-13 h-13 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-5" style={{ width: 52, height: 52 }}>
                {f.icon}
              </div>
              <div className="font-display font-semibold text-white mb-2">{f.title}</div>
              <p className="text-[0.88rem] text-white/50 leading-7">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
