import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { API_BASE_URL } from '../lib/config';
import { User, LogOut, Package, Heart, ShoppingBag, Shield, Mail, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user, logout } = useAuth();
  const { wishlist, clearWishlist } = useWishlist();
  const { cartCount, clearCart } = useCart();
  const navigate = useNavigate();

  const [orderCount, setOrderCount] = useState(0);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=profile');
      return;
    }

    const fetchOrderCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/v1/orders/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setOrderCount(data.total || 0);
        }
      } catch (err) {
        console.error('Error fetching order count:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrderCount();
  }, [user, navigate]);

  const handleSignOut = () => {
    logout();
    clearCart();
    clearWishlist();
    navigate('/');
  };

  if (!user) return null;

  const cards = [
    {
      title: 'Orders Placed',
      value: loadingOrders ? '...' : orderCount,
      desc: 'View your purchase history',
      icon: Package,
      path: '/orders',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'My Wishlist',
      value: wishlist.length,
      desc: 'Items you have saved',
      icon: Heart,
      path: '/wishlist',
      color: 'bg-red-50 text-red-500',
    },
    {
      title: 'Active Cart',
      value: cartCount,
      desc: 'Items waiting in your bag',
      icon: ShoppingBag,
      path: '/',
      color: 'bg-green-50 text-green-600',
      action: () => navigate('/'), // trigger opening drawer or go home
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-8">
        
        <h1 className="font-display font-bold text-4xl text-black tracking-tight mb-12 uppercase tracking-wider">
          Account Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Profile Detail */}
          <div className="md:col-span-4 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-accent text-black rounded-full flex items-center justify-center font-display font-black text-3xl shadow-md mb-6">
              {user.name ? user.name.charAt(0).toUpperCase() : <User size={36} />}
            </div>

            <h2 className="font-display font-bold text-lg text-black mb-1">{user.name}</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-8">
              <Mail size={12} /> {user.email}
            </div>

            <div className="w-full space-y-3 pt-6 border-t border-gray-50">
              <div className="flex justify-between items-center text-xs text-gray-500 py-1">
                <span>Account Role</span>
                <span className="font-bold text-black uppercase flex items-center gap-1">
                  {user.role === 'admin' && <Shield size={12} className="text-accent fill-black" />}
                  {user.role || 'user'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 py-1">
                <span>Member since</span>
                <span className="font-bold text-black flex items-center gap-1">
                  <Calendar size={12} className="text-gray-400" /> May 2026
                </span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full mt-10 bg-red-50 hover:bg-red-100 text-red-500 py-3.5 rounded-2xl font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>

          {/* Right Panel: Metrics Cards & Dashboard Links */}
          <div className="md:col-span-8 space-y-6">
            <h3 className="font-display font-bold text-xs text-gray-400 uppercase tracking-widest mb-2">
              Dashboard Overview
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {cards.map((card, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  key={card.title}
                  onClick={card.action || (() => navigate(card.path))}
                  className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-display font-black text-3xl text-black">
                      {card.value}
                    </span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                      <card.icon size={18} />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs text-black mb-1">{card.title}</h4>
                    <p className="text-[10px] text-gray-400 leading-snug">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h4 className="font-display font-bold text-sm text-black uppercase tracking-wider mb-6">
                Profile Settings
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <h5 className="font-display font-bold text-xs text-black mb-0.5">Shipping Addresses</h5>
                    <p className="text-[10px] text-gray-400">Manage your saved locations for quick checkout</p>
                  </div>
                  <span className="text-[10px] bg-gray-200 font-bold px-2 py-0.5 rounded text-gray-500 uppercase">Coming Soon</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <h5 className="font-display font-bold text-xs text-black mb-0.5">Password & Security</h5>
                    <p className="text-[10px] text-gray-400">Keep your account secure with strong credentials</p>
                  </div>
                  <span className="text-[10px] bg-gray-200 font-bold px-2 py-0.5 rounded text-gray-500 uppercase">Coming Soon</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
