import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { API_BASE_URL } from '../lib/config';
import { User, LogOut, Package, Heart, ShoppingBag, Shield, Mail, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { COUNTRIES } from './Checkout';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const { wishlist, clearWishlist } = useWishlist();
  const { cartCount, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [orderCount, setOrderCount] = useState(0);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Form toggles
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Address Form State
  const [addressData, setAddressData] = useState({
    address: user?.shippingAddress?.address || '',
    city: user?.shippingAddress?.city || '',
    zip: user?.shippingAddress?.zip || '',
    country: user?.shippingAddress?.country || 'United States',
    phone: user?.shippingAddress?.phone || '',
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Keep address form prefilled from user state updates
  useEffect(() => {
    if (user?.shippingAddress) {
      setAddressData({
        address: user.shippingAddress.address || '',
        city: user.shippingAddress.city || '',
        zip: user.shippingAddress.zip || '',
        country: user.shippingAddress.country || 'United States',
        phone: user.shippingAddress.phone || '',
      });
    }
  }, [user]);

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    setIsUpdatingAddress(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shippingAddress: addressData }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update address');
      }
      updateUser({ shippingAddress: data.shippingAddress });
      showToast('Shipping address updated successfully!', 'success');
      setShowAddressForm(false);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsUpdatingAddress(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      showToast('New passwords do not match!', 'error');
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/users/me/change-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }
      showToast('Password changed successfully!', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setShowPasswordForm(false);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

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
                {/* Shipping Addresses Section */}
                <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <h5 className="font-display font-bold text-xs text-black mb-0.5">Shipping Addresses</h5>
                      <p className="text-[10px] text-gray-400">Manage your saved locations for quick checkout</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowAddressForm(!showAddressForm);
                        setShowPasswordForm(false);
                      }}
                      className="text-[10px] bg-black hover:bg-accent hover:text-black font-bold px-3 py-1.5 rounded-lg text-white uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {showAddressForm ? 'Cancel' : 'Manage'}
                    </button>
                  </div>

                  <AnimatePresence>
                    {showAddressForm && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-4 pb-6 pt-2 border-t border-gray-100/50 bg-white"
                      >
                        <form onSubmit={handleUpdateAddress} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="address-phone" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number</label>
                              <input
                                type="tel"
                                id="address-phone"
                                required
                                value={addressData.phone}
                                onChange={(e) => setAddressData(prev => ({ ...prev, phone: e.target.value }))}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                placeholder="(555) 000-0000"
                              />
                            </div>
                            <div>
                              <label htmlFor="address-country" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Country / Region</label>
                              <select
                                id="address-country"
                                value={addressData.country}
                                onChange={(e) => setAddressData(prev => ({ ...prev, country: e.target.value }))}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                              >
                                {COUNTRIES.map((c) => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label htmlFor="address-street" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Street Address</label>
                            <input
                              type="text"
                              id="address-street"
                              required
                              value={addressData.address}
                              onChange={(e) => setAddressData(prev => ({ ...prev, address: e.target.value }))}
                              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                              placeholder="123 Main St, Apt 4B"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="address-city" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">City</label>
                              <input
                                type="text"
                                id="address-city"
                                required
                                value={addressData.city}
                                onChange={(e) => setAddressData(prev => ({ ...prev, city: e.target.value }))}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                placeholder="New York"
                              />
                            </div>
                            <div>
                              <label htmlFor="address-zip" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">ZIP / Postal Code</label>
                              <input
                                type="text"
                                id="address-zip"
                                required
                                value={addressData.zip}
                                onChange={(e) => setAddressData(prev => ({ ...prev, zip: e.target.value }))}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                placeholder="10001"
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            disabled={isUpdatingAddress}
                            className="w-full mt-2 bg-black hover:bg-accent hover:text-black text-white py-3 rounded-xl font-display font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50 cursor-pointer"
                          >
                            {isUpdatingAddress ? 'Saving...' : 'Save Address'}
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Password & Security Section */}
                <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <h5 className="font-display font-bold text-xs text-black mb-0.5">Password & Security</h5>
                      <p className="text-[10px] text-gray-400">Keep your account secure with strong credentials</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowPasswordForm(!showPasswordForm);
                        setShowAddressForm(false);
                      }}
                      className="text-[10px] bg-black hover:bg-accent hover:text-black font-bold px-3 py-1.5 rounded-lg text-white uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {showPasswordForm ? 'Cancel' : 'Change'}
                    </button>
                  </div>

                  <AnimatePresence>
                    {showPasswordForm && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-4 pb-6 pt-2 border-t border-gray-100/50 bg-white"
                      >
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                          <div>
                            <label htmlFor="curr-pass" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Current Password</label>
                            <input
                              type="password"
                              id="curr-pass"
                              required
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                              placeholder="••••••••"
                            />
                          </div>
                          <div>
                            <label htmlFor="new-pass" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">New Password (Min 6 chars)</label>
                            <input
                              type="password"
                              id="new-pass"
                              required
                              minLength={6}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                              placeholder="••••••••"
                            />
                          </div>
                          <div>
                            <label htmlFor="confirm-pass" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Confirm New Password</label>
                            <input
                              type="password"
                              id="confirm-pass"
                              required
                              value={passwordData.confirmNewPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmNewPassword: e.target.value }))}
                              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                              placeholder="••••••••"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={isUpdatingPassword}
                            className="w-full mt-2 bg-black hover:bg-accent hover:text-black text-white py-3 rounded-xl font-display font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50 cursor-pointer"
                          >
                            {isUpdatingPassword ? 'Updating...' : 'Change Password'}
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
