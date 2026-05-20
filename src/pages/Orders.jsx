import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../lib/config';
import { ShoppingBag, ArrowRight, Calendar, Loader, Package, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=orders');
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/v1/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch orders');
        }

        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  // Color mappings for shipment status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'shipped':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-100';
      case 'delivered':
        return 'bg-green-50 text-green-600 border border-green-100';
      default:
        return 'bg-gray-50 text-gray-500 border border-gray-100';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-8">
        
        <h1 className="font-display font-bold text-4xl text-black tracking-tight mb-12 uppercase tracking-wider">
          My Orders
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader className="animate-spin text-black mb-4" size={32} />
            <p className="font-display font-bold text-gray-500 text-sm">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <AlertCircle className="text-red-500 mb-4" size={48} />
            <h3 className="font-display font-bold text-lg mb-2">Error Loading Orders</h3>
            <p className="text-gray-500 text-sm mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-black text-white px-6 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider hover:bg-accent hover:text-black transition-all"
            >
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <Package className="text-gray-300 mb-6" size={64} />
            <h3 className="font-display font-bold text-xl uppercase tracking-widest text-black mb-2">
              No Orders Found
            </h3>
            <p className="text-gray-400 text-sm mb-8 max-w-sm leading-relaxed">
              Looks like you haven't placed any orders yet. Check out our latest products!
            </p>
            <Link
              to="/shop"
              className="bg-black text-white px-8 py-4.5 rounded-2xl font-display font-bold text-xs uppercase tracking-[0.2em] hover:bg-accent hover:text-black transition-all flex items-center gap-2 group"
            >
              Start Shopping <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order, orderIdx) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(orderIdx * 0.08, 0.4) }}
                key={order._id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* Order Top Bar Info */}
                <div className="bg-gray-50 px-8 py-5 border-b border-gray-100 flex flex-wrap gap-6 items-center justify-between">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[0.6rem] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Order Placed</p>
                      <p className="font-display font-bold text-xs text-black">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[0.6rem] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total Amount</p>
                      <p className="font-display font-bold text-xs text-black">
                        ${order.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-[0.6rem] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Order ID</p>
                      <p className="font-display font-bold text-[10px] text-gray-500 uppercase select-all truncate max-w-[150px]">
                        {order._id}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[0.65rem] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${getStatusColor(order.status)}`}>
                    {order.status || 'Processing'}
                  </span>
                </div>

                {/* Purchased Items List */}
                <div className="p-8 divide-y divide-gray-50">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-6 py-5 first:pt-0 last:pb-0">
                      <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-contain" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <h4 className="font-display font-bold text-sm uppercase text-black line-clamp-1">
                              {item.name}
                            </h4>
                            <span className="font-display font-bold text-sm text-black shrink-0">
                              ${(parseFloat(item.price.replace(',', '')) * item.quantity).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                            {item.category}
                          </p>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                          <span>Qty: {item.quantity} &middot; ${parseFloat(item.price.replace(',', '')).toLocaleString()} each</span>
                          <Link
                            to={`/product/${item.id}`}
                            className="text-black font-semibold border-b border-black pb-0.5 hover:text-accent hover:border-accent transition-colors"
                          >
                            Buy Again
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Destination Footer details */}
                <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="font-medium">
                    Shipped to: <span className="font-bold text-gray-600">{order.shippingAddress.name}</span> &middot; {order.shippingAddress.address}, {order.shippingAddress.city}
                  </span>
                  <span className="font-medium hidden sm:inline">
                    Payment Reference: <span className="font-mono">{order.paymentId}</span>
                  </span>
                </div>

              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
