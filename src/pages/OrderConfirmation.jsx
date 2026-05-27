import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ShoppingBag, ArrowRight, Calendar, User, MapPin } from 'lucide-react';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Load from location state, fallback to localStorage
  const order = location.state?.order || (() => {
    const saved = localStorage.getItem('latest_order');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  // Redirect to home if accessed directly without order data
  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  // Safe helper to parse items price
  const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    if (!price) return 0;
    const cleaned = String(price).replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  return (
    <div className="relative min-h-screen bg-white pt-32 pb-24 flex items-center justify-center overflow-hidden">
      {/* Visual background accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-3xl w-full px-8 relative z-10">
        
        {/* Animated Checkmark Circle */}
        <div className="flex flex-col items-center text-center mb-10">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-24 h-24 bg-accent text-black rounded-full flex items-center justify-center shadow-xl shadow-accent/25 mb-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.3 }}
            >
              <Check size={44} strokeWidth={3} />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="font-display font-black text-3xl sm:text-5xl text-black uppercase tracking-wider mb-3"
          >
            Order Confirmed
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-gray-500 font-medium text-sm sm:text-base max-w-md"
          >
            Thank you for your purchase! Your order is being processed and a confirmation has been logged.
          </motion.p>
        </div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white/80 backdrop-blur-md rounded-[32px] border border-gray-100 shadow-xl shadow-gray-100/50 p-8 sm:p-10 mb-8 divide-y divide-gray-100"
        >
          {/* Header metadata */}
          <div className="pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
              <p className="font-display font-bold text-sm text-black truncate select-all">
                {order._id}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-1">Date</p>
              <p className="font-display font-bold text-sm text-black flex items-center gap-1.5 sm:justify-end">
                <Calendar size={14} className="text-gray-400" />
                {order?.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }) : 'N/A'}
              </p>
            </div>
          </div>

          {/* Delivery & details */}
          <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <User size={12} /> Customer details
              </h3>
              <p className="text-sm font-bold text-black">{order?.shippingAddress?.name || 'N/A'}</p>
              <p className="text-xs text-gray-500 mt-0.5">{order?.shippingAddress?.email || 'N/A'}</p>
              <p className="text-xs text-gray-500 mt-0.5">{order?.shippingAddress?.phone || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <MapPin size={12} /> Shipping Address
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {order?.shippingAddress?.address || 'N/A'}, <br />
                {order?.shippingAddress?.city || 'N/A'}, {order?.shippingAddress?.state ? `${order.shippingAddress.state}, ` : ''}{order?.shippingAddress?.zip || ''} <br />
                {order?.shippingAddress?.country || ''}
              </p>
            </div>
          </div>

          {/* Items Summary list */}
          <div className="py-6">
            <h3 className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-4">
              Items Purchased
            </h3>
            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
              {(order?.items || []).map((item) => (
                <div key={item?.id || Math.random().toString()} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
                      <img src={item?.image} alt={item?.name} className="w-8 h-8 object-contain" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-black uppercase tracking-tight line-clamp-1">{item?.name || 'Unknown Item'}</p>
                      <p className="text-[0.6rem] text-gray-400 uppercase font-semibold">Qty: {item?.quantity || 1}</p>
                    </div>
                  </div>
                  <span className="font-display font-bold text-xs text-black">
                    ${(parsePrice(item?.price) * (item?.quantity || 1)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Amount total */}
          <div className="pt-6 flex justify-between items-center">
            <span className="font-display font-bold text-xs text-black uppercase tracking-wider">Total Paid</span>
            <span className="font-display font-black text-2xl text-black">
              ${(order?.amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/orders"
            className="flex-1 bg-black text-white py-5 rounded-2xl font-display font-bold text-xs uppercase tracking-[0.25em] hover:bg-accent hover:text-black transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-black/5 hover:shadow-accent/15"
          >
            <ShoppingBag size={14} /> View My Orders
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/"
            className="flex-1 bg-white border border-gray-200 text-black py-5 rounded-2xl font-display font-bold text-xs uppercase tracking-[0.25em] hover:bg-black hover:text-white hover:border-black transition-all duration-300 flex items-center justify-center shadow-sm"
          >
            Continue Shopping
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
