import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ShoppingBag, ArrowRight, Calendar, User, MapPin } from 'lucide-react';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  // Redirect to home if accessed directly without order data
  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24 flex items-center justify-center">
      <div className="max-w-3xl w-full px-8">
        
        {/* Animated Checkmark Circle */}
        <div className="flex flex-col items-center text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            className="w-20 h-20 bg-accent text-black rounded-full flex items-center justify-center shadow-lg shadow-accent/20 mb-6"
          >
            <motion.div
              initial={{ draw: 0 }}
              animate={{ draw: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Check size={36} strokeWidth={3} />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="font-display font-black text-3xl sm:text-4xl text-black uppercase tracking-wide mb-2"
          >
            Order Confirmed
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="text-gray-500 font-medium text-sm"
          >
            Thank you for your purchase! Your order is being processed.
          </motion.p>
        </div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-8 divide-y divide-gray-100"
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
                {new Date(order.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Delivery & details */}
          <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <User size={12} /> Customer details
              </h3>
              <p className="text-sm font-bold text-black">{order.shippingAddress.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{order.shippingAddress.email}</p>
              <p className="text-xs text-gray-500 mt-0.5">{order.shippingAddress.phone}</p>
            </div>
            <div>
              <h3 className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <MapPin size={12} /> Shipping Address
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {order.shippingAddress.address}, <br />
                {order.shippingAddress.city}, {order.shippingAddress.zip} <br />
                {order.shippingAddress.country}
              </p>
            </div>
          </div>

          {/* Items Summary list */}
          <div className="py-6">
            <h3 className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-4">
              Items Purchased
            </h3>
            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-6 h-6 object-contain" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-black uppercase tracking-tight line-clamp-1">{item.name}</p>
                      <p className="text-[0.6rem] text-gray-400 uppercase font-semibold">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-display font-bold text-xs text-black">
                    ${(parseFloat(item.price.replace(',', '')) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Amount total */}
          <div className="pt-6 flex justify-between items-center">
            <span className="font-display font-bold text-xs text-black uppercase tracking-wider">Total Paid</span>
            <span className="font-display font-black text-2xl text-black">
              ${order.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
            className="flex-1 bg-black text-white py-4.5 rounded-2xl font-display font-bold text-xs uppercase tracking-[0.25em] hover:bg-accent hover:text-black transition-all flex items-center justify-center gap-2 group"
          >
            <ShoppingBag size={14} /> View My Orders
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/"
            className="flex-1 bg-white border border-gray-200 text-black py-4.5 rounded-2xl font-display font-bold text-xs uppercase tracking-[0.25em] hover:bg-gray-50 hover:border-black transition-all flex items-center justify-center"
          >
            Continue Shopping
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
