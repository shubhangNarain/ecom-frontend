import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Newsletter() {
  const [email, setEmail]         = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="bg-accent py-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">

          <h2
            className="font-display font-bold text-black leading-tight max-w-md"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}
          >
            Stay Ahead of the<br />Tech Curve
          </h2>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 max-w-md text-center font-display font-semibold text-lg text-black"
            >
              ✅ You&rsquo;re in! We&rsquo;ll keep you posted on the latest drops.
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex gap-3 flex-1 max-w-md w-full"
            >
              <input
                type="email"
                className="flex-1 bg-transparent border-2 border-black rounded-full px-5 py-3.5 font-display text-[0.9rem] text-black placeholder:text-black/45 outline-none focus:bg-black/5 transition-colors"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <motion.button
                type="submit"
                whileHover={{ y: -2, backgroundColor: '#0a0a0a' }}
                transition={{ duration: 0.2 }}
                className="bg-black text-accent font-display font-semibold text-sm px-7 py-3.5 rounded-full whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
