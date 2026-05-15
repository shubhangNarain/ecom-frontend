import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import NewArrivals from './pages/NewArrivals';
import Sale from './pages/Sale';
import About from './pages/About';
import ProductDetail from './pages/ProductDetail';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import './index.css';
import Lenis from 'lenis';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const { pathname } = useLocation();

  // Smooth Scroll and Scroll-to-top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div className="bg-white min-h-screen selection:bg-accent selection:text-black">
      <CustomCursor />
      <Navbar cartCount={3} onSearch={setSearchQuery} />
      
      <Routes>
        <Route path="/" element={<Home searchQuery={searchQuery} />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
