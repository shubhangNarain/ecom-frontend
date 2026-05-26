import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../lib/config';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('jauter_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const { user } = useAuth();
  const [hasFetchedCart, setHasFetchedCart] = useState(false);

  // Fetch cart on login
  useEffect(() => {
    if (user && !hasFetchedCart) {
      const token = localStorage.getItem('token');
      fetch(`${API_BASE_URL}/api/v1/users/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.cart && data.cart.length > 0) {
          // If local cart is empty, use backend cart. 
          // If local cart has items, we will let the next useEffect sync the local cart up to the backend.
          if (cart.length === 0) {
            setCart(data.cart);
          }
        }
        setHasFetchedCart(true);
      })
      .catch(err => console.error('Error fetching cart:', err));
    }
  }, [user, hasFetchedCart, cart.length]);

  // Sync cart local & backend
  useEffect(() => {
    localStorage.setItem('jauter_cart', JSON.stringify(cart));
    
    if (user && hasFetchedCart) {
      const token = localStorage.getItem('token');
      const timer = setTimeout(() => {
        fetch(`${API_BASE_URL}/api/v1/users/cart`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ cart })
        }).catch(err => console.error('Error updating backend cart:', err));
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [cart, user, hasFetchedCart]);

  const addItem = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Reset fetch tracker and clear cart when user logs out
  useEffect(() => {
    if (!user) {
      setHasFetchedCart(false);
      setCart([]);
    }
  }, [user]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce(
    (total, item) =>
      total + parseFloat(item.price.replace(',', '')) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
