import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Heart, Menu, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar({ cartCount = 3, onSearch }) {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery]           = useState('');
  const inputRef                    = useRef(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch?.('');
    inputRef.current?.focus();
  };

  const handleClose = () => {
    setSearchOpen(false);
    setQuery('');
    onSearch?.('');
  };

  const NAV_LINKS = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'New Arrivals', path: '/new-arrivals' },
    { name: 'Sale', path: '/sale' },
    { name: 'About', path: '/about' }
  ];

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-black text-accent text-center py-2.5 px-8 font-display text-[0.72rem] font-semibold tracking-[0.12em] uppercase">
        ⚡ Free shipping on orders over $99 &nbsp;|&nbsp; New arrivals every week &nbsp;|&nbsp; Use code TECH20 for 20% off
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-[72px] gap-8">

          {/* Logo */}
          <Link to="/" className="font-display text-[1.6rem] font-bold tracking-tight text-black shrink-0">
            Jaut<span className="text-accent bg-black px-1 rounded">er</span>
          </Link>

          {/* Nav links */}
          <ul className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    relative font-display text-[0.88rem] font-medium transition-colors duration-200
                    after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300
                    ${isActive ? 'text-black after:w-full' : 'text-gray-500 hover:text-black after:w-0 hover:after:w-full'}
                  `}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-3">

            {/* ── Expanding search bar (Framer Motion) ── */}
            <motion.div
              animate={{ width: searchOpen ? 256 : 40 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`flex items-center h-10 rounded-full overflow-hidden transition-colors transition-shadow duration-350
                ${searchOpen ? 'bg-gray-100 shadow-[0_0_0_2px_#c6f135]' : 'bg-transparent'}`}
              onHoverStart={() => setSearchOpen(true)}
              onHoverEnd={() => { if (!query) setSearchOpen(false); }}
            >
              {/* Search icon button */}
              <button
                className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-black z-10"
                aria-label="Search"
                onClick={() => setSearchOpen((o) => !o)}
              >
                <Search size={18} />
              </button>

              {/* Input fades in after wrapper opens */}
              <AnimatePresence>
                {searchOpen && (
                  <motion.input
                    key="search-input"
                    ref={inputRef}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.22, delay: 0.15 }}
                    type="text"
                    className="flex-1 min-w-0 bg-transparent border-none outline-none font-display text-[0.88rem] text-black placeholder:text-gray-400"
                    placeholder="Search products…"
                    value={query}
                    onChange={handleChange}
                    onKeyDown={(e) => e.key === 'Escape' && handleClose()}
                    aria-label="Search products"
                  />
                )}
              </AnimatePresence>

              {/* Clear button */}
              <AnimatePresence>
                {query && (
                  <motion.button
                    key="clear-btn"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.15 }}
                    onClick={handleClear}
                    className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-accent hover:text-black mr-1.5 transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={13} />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Wishlist */}
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-black" aria-label="Wishlist">
              <Heart size={18} />
            </button>

            {/* Cart */}
            <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-black" aria-label="Cart">
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-accent text-black text-[0.6rem] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-gray-100 bg-white"
            >
              <div className="px-8 py-6">
                {/* Mobile search */}
                <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2.5 mb-5">
                  <Search size={16} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search products…"
                    value={query}
                    onChange={handleChange}
                    className="flex-1 bg-transparent border-none outline-none font-display text-sm text-black placeholder:text-gray-400"
                  />
                </div>
                <ul className="flex flex-col gap-4">
                  {NAV_LINKS.map((item) => (
                    <li key={item.name}>
                      <Link 
                        to={item.path} 
                        onClick={() => setMenuOpen(false)}
                        className="font-display font-semibold text-base text-black hover:text-accent transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
