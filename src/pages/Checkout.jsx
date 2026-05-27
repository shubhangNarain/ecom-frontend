import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, ShieldCheck, Tag, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../lib/config';

export const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas",
  "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin",
  "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
  "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon",
  "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia",
  "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana",
  "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti",
  "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
  "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan",
  "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon",
  "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro",
  "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
  "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia",
  "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea",
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
  "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Samoa", "San Marino",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
  "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
  "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
  "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda",
  "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay",
  "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen",
  "Zambia", "Zimbabwe"
];

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  // Redirect if not logged in or cart is empty
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else if (cart.length === 0 && !isOrderPlaced) {
      navigate('/');
    }
  }, [user, cart, navigate, isOrderPlaced]);

  // Form states
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.shippingAddress?.phone || '',
    address: user?.shippingAddress?.address || '',
    city: user?.shippingAddress?.city || '',
    state: user?.shippingAddress?.state || '',
    country: user?.shippingAddress?.country || 'United States',
    zip: user?.shippingAddress?.zip || '',
  });

  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in percentage
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('mock'); // 'mock' or 'razorpay'
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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
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

      if (selectedMethod === 'mock') {
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
              state: formData.state,
              postalCode: formData.zip,
              country: formData.country,
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

        setIsOrderPlaced(true);
        clearCart();

        updateUser({
          shippingAddress: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country,
            phone: formData.phone,
          }
        });

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
            state: data.shippingAddress.state,
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

        localStorage.setItem('latest_order', JSON.stringify(normalizedOrder));
        navigate('/order-confirmation', { state: { order: normalizedOrder } });
      } else {
        // Razorpay flow
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
        }

        const keyResponse = await fetch(`${API_BASE_URL}/api/v1/orders/razorpay-key`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const keyData = await keyResponse.json();
        if (!keyResponse.ok || !keyData.key) {
          throw new Error(keyData.message || 'Could not retrieve payment configurations.');
        }

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
              state: formData.state,
              postalCode: formData.zip,
              country: formData.country,
            },
            payment: {
              method: 'razorpay',
              status: 'pending',
            },
            shippingCharge: shipping,
            discount: discountAmount,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to initialize order');
        }

        setIsSubmitting(false); // Enable interactions while the gateway modal is open

        const options = {
          key: keyData.key,
          amount: data.razorpayOrder.amount,
          currency: data.razorpayOrder.currency,
          name: "GFG E-Commerce",
          description: `Order Payment for ${data._id}`,
          order_id: data.razorpayOrder.id,
          handler: async function (paymentResponse) {
            setIsSubmitting(true);
            try {
              const verifyResponse = await fetch(`${API_BASE_URL}/api/v1/orders/verify`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                }),
              });

              const verifyData = await verifyResponse.json();
              if (!verifyResponse.ok) {
                throw new Error(verifyData.message || 'Payment verification failed');
              }

              setIsOrderPlaced(true);
              clearCart();

              updateUser({
                shippingAddress: {
                  address: formData.address,
                  city: formData.city,
                  state: formData.state,
                  zip: formData.zip,
                  country: formData.country,
                  phone: formData.phone,
                }
              });

              const normalizedOrder = {
                _id: verifyData.order._id,
                createdAt: verifyData.order.createdAt,
                amount: verifyData.order.grandTotal,
                shippingAddress: {
                  name: verifyData.order.shippingAddress.fullName,
                  email: formData.email,
                  phone: verifyData.order.shippingAddress.phone,
                  address: verifyData.order.shippingAddress.street,
                  city: verifyData.order.shippingAddress.city,
                  state: verifyData.order.shippingAddress.state,
                  zip: verifyData.order.shippingAddress.postalCode,
                  country: verifyData.order.shippingAddress.country,
                },
                items: verifyData.order.items.map((item) => {
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

              localStorage.setItem('latest_order', JSON.stringify(normalizedOrder));
              navigate('/order-confirmation', { state: { order: normalizedOrder } });
            } catch (err) {
              setError(err.message);
            } finally {
              setIsSubmitting(false);
            }
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#000000",
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      // In the Razorpay flow, we handle isSubmitting manually in callbacks,
      // so only set isSubmitting to false here if we didn't open the modal or threw early.
      if (selectedMethod === 'mock') {
        setIsSubmitting(false);
      }
    }
  };

  if (!user || (cart.length === 0 && !isOrderPlaced)) {
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
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                  <label htmlFor="state" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">State / Province</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    placeholder="NY"
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
                  <CreditCard size={18} /> Payment Method
                </h3>
                <div className="space-y-4 mb-6">
                  {/* Mock Payment Option */}
                  <label className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedMethod === 'mock' 
                      ? 'border-black bg-gray-50/50' 
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="mock"
                        checked={selectedMethod === 'mock'}
                        onChange={() => setSelectedMethod('mock')}
                        className="w-4 h-4 text-black accent-black focus:ring-black"
                      />
                      <div>
                        <span className="font-display text-sm font-bold text-black block">
                          💳 Simulated Sandbox Payment
                        </span>
                        <span className="text-[11px] text-gray-400">Instant checkout, mock transaction</span>
                      </div>
                    </div>
                    {selectedMethod === 'mock' && (
                      <span className="text-[10px] bg-accent font-bold px-2.5 py-1 rounded-full text-black uppercase tracking-wider">Active</span>
                    )}
                  </label>

                  {/* Razorpay Option */}
                  <label className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedMethod === 'razorpay' 
                      ? 'border-black bg-gray-50/50' 
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={selectedMethod === 'razorpay'}
                        onChange={() => setSelectedMethod('razorpay')}
                        className="w-4 h-4 text-black accent-black focus:ring-black"
                      />
                      <div>
                        <span className="font-display text-sm font-bold text-black block">
                          🚀 Pay via Razorpay
                        </span>
                        <span className="text-[11px] text-gray-400">Cards, UPI, Netbanking, Wallets</span>
                      </div>
                    </div>
                    {selectedMethod === 'razorpay' && (
                      <span className="text-[10px] bg-accent font-bold px-2.5 py-1 rounded-full text-black uppercase tracking-wider">Active</span>
                    )}
                  </label>
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
