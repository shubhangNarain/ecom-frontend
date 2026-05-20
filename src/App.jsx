import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

// Lazy load pages for better FCP
const Shop = lazy(() => import('./pages/Shop'));
const NewArrivals = lazy(() => import('./pages/NewArrivals'));
const Sale = lazy(() => import('./pages/Sale'));
const About = lazy(() => import('./pages/About'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Search = lazy(() => import('./pages/Search'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const Orders = lazy(() => import('./pages/Orders'));
const Profile = lazy(() => import('./pages/Profile'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import CartDrawer from './components/CartDrawer';
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
    <AuthProvider>
      <ProductProvider>
        <WishlistProvider>
          <CartProvider>
            <div className="bg-white min-h-screen selection:bg-accent selection:text-black">
            <CustomCursor />
            <CartDrawer />
            <Navbar onSearch={setSearchQuery} />
            
            <Suspense fallback={<div className="min-h-screen bg-white" />}>
              <Routes>
                <Route path="/" element={<Home searchQuery={searchQuery} />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/new-arrivals" element={<NewArrivals />} />
                <Route path="/sale" element={<Sale />} />
                <Route path="/about" element={<About />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/search" element={<Search />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/wishlist" element={<Wishlist />} />
              </Routes>
            </Suspense>

            <Footer />
          </div>
          </CartProvider>
        </WishlistProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
