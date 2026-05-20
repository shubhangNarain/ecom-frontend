import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, CheckCircle2, CreditCard, MapPin, Truck, ChevronLeft } from 'lucide-react';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [billingName, setBillingName] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [billingPhone, setBillingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingPostal, setShippingPostal] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingFee = useMemo(() => {
    if (cartTotal === 0) return 0;
    return cartTotal >= 100 ? 0 : 5.99;
  }, [cartTotal]);

  const tax = useMemo(() => Number((cartTotal * 0.08).toFixed(2)), [cartTotal]);
  const orderTotal = useMemo(() => Number((cartTotal + shippingFee + tax).toFixed(2)), [cartTotal, shippingFee, tax]);

  const isFormValid = billingName && billingEmail && billingPhone && shippingAddress && shippingCity && shippingPostal && paymentMethod;

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    if (!isFormValid) {
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    clearCart();
    setOrderPlaced(true);
    setIsSubmitting(false);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-[2rem] shadow-[0_30px_70px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 text-accent mb-8 mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h1 className="font-display text-4xl font-bold mb-4">Order Confirmed</h1>
            <p className="text-gray-500 max-w-xl mx-auto mb-8">
              Thank you for your purchase. Your order has been received and is being processed. We will send a confirmation email shortly.
            </p>
            <div className="space-x-3">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 bg-black text-white py-4 px-6 rounded-2xl font-bold uppercase tracking-[0.15em] hover:bg-accent hover:text-black transition-all"
              >
                Continue Shopping
                <ArrowRight size={16} />
              </button>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-black py-4 px-6 rounded-2xl border border-gray-200 font-bold uppercase tracking-[0.15em] hover:border-black transition-all"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-[1300px] mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-gray-400 mb-3">Secure Checkout</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              Complete your order
            </h1>
            <p className="max-w-2xl text-gray-500 mt-4">
              Review your items, enter shipping details, and select your payment method to complete the purchase.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm text-sm text-gray-500">
            <div className="flex items-center gap-3 mb-3">
              <Truck size={18} />
              <span>Free shipping over $100</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <MapPin size={18} />
              <span>Fast delivery available across the US</span>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard size={18} />
              <span>Secure payment powered by the platform</span>
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-[2rem] border border-gray-200 bg-white p-12 text-center shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
            <h2 className="font-display text-3xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">
              Add items to your bag before checking out. We saved your progress so you can continue shopping anytime.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-black text-white py-4 px-6 rounded-2xl font-bold uppercase tracking-[0.15em] hover:bg-accent hover:text-black transition-all"
            >
              Shop Now
              <ChevronLeft size={16} className="rotate-180" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 xl:grid-cols-[1.6fr_1fr]">
            <motion.form
              onSubmit={handlePlaceOrder}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-[2rem] bg-white p-8 shadow-[0_30px_70px_rgba(15,23,42,0.05)] border border-gray-200"
            >
              <div className="mb-8">
                <h2 className="font-display text-2xl font-bold mb-3">Billing Details</h2>
                <p className="text-sm text-gray-500">Enter the address and contact details for your order.</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-gray-700">
                  <span className="font-bold uppercase tracking-[0.15em]">Full name</span>
                  <input
                    value={billingName}
                    onChange={(e) => setBillingName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </label>
                <label className="space-y-2 text-sm text-gray-700">
                  <span className="font-bold uppercase tracking-[0.15em]">Email</span>
                  <input
                    type="email"
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </label>
                <label className="space-y-2 text-sm text-gray-700">
                  <span className="font-bold uppercase tracking-[0.15em]">Phone</span>
                  <input
                    type="tel"
                    value={billingPhone}
                    onChange={(e) => setBillingPhone(e.target.value)}
                    placeholder="(123) 456-7890"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </label>
                <label className="space-y-2 text-sm text-gray-700">
                  <span className="font-bold uppercase tracking-[0.15em]">Postal code</span>
                  <input
                    value={shippingPostal}
                    onChange={(e) => setShippingPostal(e.target.value)}
                    placeholder="12345"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </label>
              </div>

              <div className="mt-8 space-y-5">
                <h3 className="font-display text-xl font-bold">Shipping Address</h3>

                <label className="space-y-2 text-sm text-gray-700">
                  <span className="font-bold uppercase tracking-[0.15em]">Address</span>
                  <input
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="123 Main Street"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-gray-700">
                    <span className="font-bold uppercase tracking-[0.15em]">City</span>
                    <input
                      value={shippingCity}
                      onChange={(e) => setShippingCity(e.target.value)}
                      placeholder="New York"
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-gray-700">
                    <span className="font-bold uppercase tracking-[0.15em]">Country</span>
                    <select
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black"
                      value="United States"
                      disabled
                    >
                      <option>United States</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="mt-8 rounded-[2rem] border border-gray-200 bg-gray-50 p-6">
                <h3 className="font-display text-xl font-bold mb-5">Payment</h3>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`w-full text-left rounded-2xl border px-4 py-4 transition-all ${paymentMethod === 'card' ? 'border-black bg-white' : 'border-transparent bg-gray-100 hover:bg-gray-200'}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <CreditCard size={18} />
                        <div>
                          <p className="font-semibold">Credit / debit card</p>
                          <p className="text-sm text-gray-500">Visa, Mastercard, Amex</p>
                        </div>
                      </div>
                      {paymentMethod === 'card' && <span className="text-accent font-bold">Selected</span>}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`w-full text-left rounded-2xl border px-4 py-4 transition-all ${paymentMethod === 'cod' ? 'border-black bg-white' : 'border-transparent bg-gray-100 hover:bg-gray-200'}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Truck size={18} />
                        <div>
                          <p className="font-semibold">Cash on delivery</p>
                          <p className="text-sm text-gray-500">Pay when your order arrives.</p>
                        </div>
                      </div>
                      {paymentMethod === 'cod' && <span className="text-accent font-bold">Selected</span>}
                    </div>
                  </button>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  {!user ? (
                    <p className="text-sm text-red-500">
                      Sign in to complete checkout and save your order.
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">You are signed in as {user.name || user.email}.</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!user || !isFormValid || isSubmitting}
                  className="inline-flex items-center justify-center gap-3 rounded-2xl bg-black px-6 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white transition-all hover:bg-accent hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Placing Order...' : 'Place Order'}
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.form>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-[0_30px_70px_rgba(15,23,42,0.05)]"
            >
              <div className="mb-8">
                <h2 className="font-display text-2xl font-bold mb-3">Order Summary</h2>
                <p className="text-sm text-gray-500">Review your bag before placing the order.</p>
              </div>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 rounded-3xl border border-gray-100 bg-gray-50 p-4">
                    <div className="h-20 w-20 rounded-3xl bg-white flex items-center justify-center overflow-hidden">
                      <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <p className="font-display font-bold text-sm uppercase tracking-tight line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-display font-bold text-sm">${(parseFloat(item.price.replace(',', '')) * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[2rem] border border-gray-200 bg-white p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Shipping</span>
                    <span>{shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Estimated tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-5">
                  <span className="font-display text-lg font-bold">Total</span>
                  <span className="font-display text-3xl font-black">${orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
