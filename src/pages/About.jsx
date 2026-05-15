import { motion } from 'framer-motion';
import { Target, Zap, Shield, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Editorial Header */}
      <section className="pt-40 pb-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[0.7rem] font-semibold tracking-[0.3em] uppercase text-gray-400 mb-6"
          >
            Since 2025
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-bold text-[4rem] lg:text-[6rem] tracking-tighter text-black leading-[0.9] mb-12"
          >
            Redefining <br /> <span className="text-accent">Human</span> Tech.
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="h-px w-full bg-gray-200 origin-left"
          />
        </div>
      </section>

      {/* The Vision Section */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-gray-200 rounded-3xl overflow-hidden relative group">
                 {/* Imagine a high-end lifestyle tech photo here */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                 <div className="absolute bottom-10 left-10 text-white">
                    <p className="font-display font-bold text-2xl">Design meets Detail.</p>
                 </div>
              </div>
              {/* Floating accent card */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -right-8 -bottom-8 bg-white p-8 rounded-2xl shadow-xl max-w-[240px] border border-gray-100 hidden md:block"
              >
                <p className="text-black font-display font-bold text-lg mb-2 italic">AURA Series</p>
                <p className="text-gray-400 text-xs leading-5">Our flagship audio line redefined how we interact with sound in shared spaces.</p>
              </motion.div>
            </motion.div>

            <div>
              <h2 className="font-display font-bold text-3xl text-black mb-8 tracking-tight italic">Beyond the Specification.</h2>
              <p className="text-gray-500 text-lg leading-8 mb-8">
                At Jauter, we believe that technology should feel as natural as the spaces it inhabits. We don't just build electronics; we craft experiences that bridge the gap between digital power and human intuition.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { icon: <Target className="text-accent" />, title: 'Precision', desc: 'Every curve and component is intentional.' },
                  { icon: <Zap className="text-accent" />, title: 'Innovation', desc: 'Pushing boundaries without complexity.' },
                  { icon: <Shield className="text-accent" />, title: 'Reliability', desc: 'Built to last in a fast-paced world.' },
                  { icon: <Heart className="text-accent" />, title: 'Purpose', desc: 'Tech that serves you, not the other way around.' }
                ].map((val, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="mb-4">{val.icon}</div>
                    <h3 className="font-display font-bold text-black mb-2 uppercase text-xs tracking-widest">{val.title}</h3>
                    <p className="text-gray-400 text-sm">{val.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Numbers Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center lg:text-left">
            {[
              { label: 'Founded', val: '2025' },
              { label: 'Happy Users', val: '150K+' },
              { label: 'Products Dropped', val: '24' },
              { label: 'Awards Won', val: '09' }
            ].map((s, i) => (
              <div key={i}>
                <p className="text-accent font-display font-black text-[3rem] lg:text-[4rem] leading-none mb-2 italic">{s.val}</p>
                <p className="text-gray-400 font-display font-bold text-[0.7rem] uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
        
        <div className="max-w-5xl mx-auto px-8 text-center relative z-10">
          <h2 className="font-display font-bold text-[2.5rem] lg:text-[3.5rem] tracking-tight mb-12">The Future is <span className="text-accent italic">Tactile</span>.</h2>
          <p className="text-gray-400 text-xl leading-relaxed mb-16">
            We are a collective of designers, engineers, and dreamers based globally, united by a single goal: to make premium technology accessible to everyone who appreciates fine craftsmanship.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
             <button className="bg-accent text-black px-10 py-4 rounded-full font-display font-bold text-sm hover:bg-white transition-all">
                Our Sustainability Commitment
             </button>
             <button className="bg-transparent border border-white/20 text-white px-10 py-4 rounded-full font-display font-bold text-sm hover:bg-white hover:text-black transition-all">
                Contact the Team
             </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
