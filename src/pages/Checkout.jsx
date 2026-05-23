import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, ShieldCheck, Tag, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../lib/config';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in or cart is empty
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else if (cart.length === 0) {
      navigate('/');
    }
  }, [user, cart, navigate]);

  // Form states
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    country: 'United States',
    zip: '',
  });

  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in percentage
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Calculations
  const discountAmount = (cartTotal * appliedDiscount) / 100;
  const subtotalAfterDiscount = cartTotal - discountAmount;
  const shipping = subtotalAfterDiscount > 99 ? 0 : 15;
  const tax = subtotalAfterDiscount * 0.08;
  const total = subtotalAfterDiscount + shipping + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    
    if (promoCode.trim().toUpperCase() === 'TECH20') {
      setAppliedDiscount(20);
      setPromoSuccess('Promo code TECH20 applied! 20% off.');
    } else {
      setPromoError('Invalid promo code');
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.zip) {
      setError('Please fill in all shipping details');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            product: item._id || String(item.id),
            quantity: item.quantity,
          })),
          shippingAddress: {
            fullName: formData.name,
            phone: formData.phone,
            street: formData.address,
            city: formData.city,
            postalCode: formData.zip,
            country: formData.country,
            state: "",
          },
          payment: {
            method: 'cod',
            status: 'pending',
            razorpayPaymentId: `MOCK_PAY_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          },
          shippingCharge: shipping,
          discount: discountAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      // Order created successfully
      clearCart();
      // Normalize backend response for OrderConfirmation page
      const normalizedOrder = {
        _id: data._id,
        createdAt: data.createdAt,
        amount: data.grandTotal,
        shippingAddress: {
          name: data.shippingAddress.fullName,
          email: formData.email,
          phone: data.shippingAddress.phone,
          address: data.shippingAddress.street,
          city: data.shippingAddress.city,
          zip: data.shippingAddress.postalCode,
          country: data.shippingAddress.country,
        },
        items: data.items.map((item) => {
          const cartItem = cart.find(c => (c._id === item.product || String(c.id) === String(item.product))) || {};
          return {
            id: cartItem.id || item.product,
            name: item.title,
            image: item.thumbnail,
            price: String(item.price),
            quantity: item.quantity,
          };
        }),
      };

      navigate('/order-confirmation', { state: { order: normalizedOrder } });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-display font-medium text-xs uppercase tracking-wider">Back to Cart</span>
        </Link>

        <h1 className="font-display font-bold text-4xl text-black tracking-tight mb-12">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Shipping Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="font-display font-bold text-lg text-black uppercase tracking-wider mb-6">
              Shipping Information
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    placeholder="(555) 000-0000"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Country / Region</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                    <option>Germany</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Street Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="123 Main St, Apt 4B"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="city" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label htmlFor="zip" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">ZIP / Postal Code</label>
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    required
                    value={formData.zip}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    placeholder="10001"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-display font-bold text-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CreditCard size={18} /> Payment Information
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  This is a secure mock checkout. Your card will not be charged.
                </p>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-black flex items-center gap-2">
                    💳 Simulated Payment Sandbox
                  </span>
                  <span className="text-xs bg-accent font-bold px-3 py-1 rounded-full text-black">Active</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-5 rounded-2xl font-display font-bold text-sm uppercase tracking-[0.2em] hover:bg-accent hover:text-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin" size={18} /> Placed Order...
                  </>
                ) : (
                  <>
                    Place Order &middot; ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Cart items summary */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h2 className="font-display font-bold text-lg text-black uppercase tracking-wider mb-6">
                Order Summary ({cart.length})
              </h2>

              <div className="divide-y divide-gray-50 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-bold text-xs uppercase text-black truncate">{item.name}</h4>
                      <p className="text-[0.65rem] font-bold text-gray-400 uppercase">{item.category}</p>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-display font-bold text-xs">
                      ${(parseFloat(item.price.replace(',', '')) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo input */}
              <form onSubmit={handleApplyPromo} className="mt-8 pt-6 border-t border-gray-100 flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code (e.g. TECH20)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs uppercase focus:outline-none focus:border-accent"
                />
                <button
                  type="submit"
                  className="bg-black hover:bg-accent hover:text-black text-white px-5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Apply
                </button>
              </form>
              
              {promoError && <p className="text-red-500 text-xs font-semibold mt-2">{promoError}</p>}
              {promoSuccess && <p className="text-green-600 text-xs font-semibold mt-2">{promoSuccess}</p>}

              {/* Price Breakdown */}
              <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                <div className="flex justify-between text-xs text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span>${cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-xs text-green-600 font-semibold">
                    <span className="flex items-center gap-1"><Tag size={12} /> Discount ({appliedDiscount}%)</span>
                    <span>-${discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                <div className="flex justify-between text-xs text-gray-500 font-medium">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between text-xs text-gray-500 font-medium">
                  <span>Estimated Tax (8%)</span>
                  <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="flex justify-between items-end pt-4 border-t border-gray-100">
                  <span className="font-display font-bold text-sm text-black uppercase tracking-wider">Total</span>
                  <span className="font-display font-black text-2xl text-black">
                    ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Secure checkout info */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 bg-accent/15 rounded-xl flex items-center justify-center text-accent shrink-0">
                <ShieldCheck size={20} fill="currentColor" className="text-black" />
              </div>
              <div>
                <h4 className="font-display font-bold text-xs text-black uppercase tracking-wider mb-1">
                  100% Secure Checkout
                </h4>
                <p className="text-[0.7rem] text-gray-400 leading-normal">
                  Your privacy is our priority. We process payment tokens safely using a simulated transaction mechanism.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
