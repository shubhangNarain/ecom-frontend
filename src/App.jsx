import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import FeaturedProducts from './components/FeaturedProducts';
import PromoBanners from './components/PromoBanners';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import './index.css';
import Lenis from 'lenis';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <Navbar cartCount={3} onSearch={setSearchQuery} />
      <Hero />
      <Marquee />
      <FeaturedProducts searchQuery={searchQuery} />
      <PromoBanners />
      <Features />
      <Testimonials />
      <Newsletter />
      <Footer />
    </>
  );
}

export default App;
