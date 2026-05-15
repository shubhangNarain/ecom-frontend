import { Link } from 'react-router-dom';

export default function Footer() {
  const SHOP    = [
    { name: 'All Products', path: '/shop' },
    { name: 'New Arrivals', path: '/new-arrivals' },
    { name: 'Seasonal Sale', path: '/sale' },
    { name: 'Audio', path: '/shop' },
    { name: 'Wearables', path: '/shop' },
    { name: 'Computers', path: '/shop' },
    { name: 'Gaming', path: '/shop' },
    { name: 'Photography', path: '/shop' }
  ];
  const SUPPORT = ['FAQ', 'Shipping Info', 'Returns', 'Order Tracking', 'Warranty', 'Contact Us'];
  const COMPANY = [
    { name: 'About Us', path: '/about' },
    { name: 'Blog', path: '#' },
    { name: 'Careers', path: '#' },
    { name: 'Press', path: '#' },
    { name: 'Affiliate Program', path: '#' },
    { name: 'Privacy Policy', path: '#' }
  ];
  const SOCIALS = ['𝕏', 'in', 'f', '📷'];

  return (
    <footer className="bg-black pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/8">

          {/* Brand */}
          <div>
            <div className="font-display text-[1.5rem] font-bold tracking-tight text-white mb-4">
              Jaut<span className="text-accent bg-[#222] px-1 rounded">er</span>
            </div>
            <p className="text-[0.88rem] text-white/50 leading-7 max-w-[280px]">
              Premium tech and electronics for the modern lifestyle. Quality you can trust, prices you'll love.
            </p>
            <div className="flex gap-3 mt-6">
              {SOCIALS.map((s, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/60 text-sm hover:bg-accent hover:text-black hover:border-accent transition-all duration-200"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div>
            <div className="font-display text-[0.85rem] font-semibold text-white tracking-wide uppercase mb-5">
              Shop
            </div>
            <ul className="flex flex-col gap-3">
              {SHOP.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-[0.88rem] text-white/50 hover:text-accent transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support column */}
          <div>
            <div className="font-display text-[0.85rem] font-semibold text-white tracking-wide uppercase mb-5">
              Support
            </div>
            <ul className="flex flex-col gap-3">
              {SUPPORT.map((link) => (
                <li key={link}>
                  <a href="#" className="text-[0.88rem] text-white/50 hover:text-accent transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <div className="font-display text-[0.85rem] font-semibold text-white tracking-wide uppercase mb-5">
              Company
            </div>
            <ul className="flex flex-col gap-3">
              {COMPANY.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-[0.88rem] text-white/50 hover:text-accent transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-[0.8rem] text-white/40">
          <span>© 2025 Jauter. All rights reserved.</span>
          <div className="flex gap-6">
            {COMPANY.filter(c => c.name === 'Privacy Policy').map((l) => (
              <Link key={l.name} to={l.path} className="hover:text-accent transition-colors">{l.name}</Link>
            ))}
            {['Terms of Service', 'Cookie Settings'].map((l) => (
              <a key={l} href="#" className="hover:text-accent transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
