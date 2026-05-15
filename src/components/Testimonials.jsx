import { motion } from 'framer-motion';

const TESTIMONIALS = [
  {
    stars: 5,
    text: 'Absolutely blown away by the audio quality of my new headphones. The build quality is exceptional and delivery was super fast. Highly recommend!',
    name: 'Alex M.',
    role: 'Music Producer',
    initial: 'A',
  },
  {
    stars: 3,
    text: 'The smartwatch is incredible — battery lasts all week and the health tracking is spot on. Customer support was also amazing when I had a setup question.',
    name: 'Sarah K.',
    role: 'Fitness Coach',
    initial: 'S',
  },
  {
    stars: 4,
    text: "Best electronics store I've shopped at. The prices are fair, products are genuine, and the 30-day return policy gave me total peace of mind.",
    name: 'James T.',
    role: 'Tech Enthusiast',
    initial: 'J',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Testimonials() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-12">
          <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-2">
            What Customers Say
          </p>
          <h2
            className="font-display font-bold tracking-tight text-black"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.1 }}
          >
            Loved by Thousands
          </h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              variants={item}
              whileHover={{ y: -4, boxShadow: '0 4px 20px rgba(0,0,0,0.10)' }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl p-8"
            >
              <div className="text-accent text-base tracking-widest mb-4">
                {'★'.repeat(t.stars)}
              </div>
              <p className="text-[0.95rem] text-gray-700 leading-7 italic mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-black flex items-center justify-center font-display font-bold text-accent text-sm shrink-0">
                  {t.initial}
                </div>
                <div>
                  <div className="font-display font-semibold text-[0.88rem] text-black">
                    {t.name}
                  </div>
                  <div className="text-[0.78rem] text-gray-400">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
