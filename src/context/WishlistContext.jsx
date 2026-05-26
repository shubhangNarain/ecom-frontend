import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../lib/config';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('jauter_wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  
  const { user } = useAuth();
  const [hasFetchedWishlist, setHasFetchedWishlist] = useState(false);

  // Fetch wishlist on login
  useEffect(() => {
    if (user && !hasFetchedWishlist) {
      const token = localStorage.getItem('token');
      fetch(`${API_BASE_URL}/api/v1/users/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.wishlist && data.wishlist.length > 0) {
          if (wishlist.length === 0) {
            setWishlist(data.wishlist);
          }
        }
        setHasFetchedWishlist(true);
      })
      .catch(err => console.error('Error fetching wishlist:', err));
    }
  }, [user, hasFetchedWishlist, wishlist.length]);

  // Sync wishlist local & backend
  useEffect(() => {
    localStorage.setItem('jauter_wishlist', JSON.stringify(wishlist));
    
    if (user && hasFetchedWishlist) {
      const token = localStorage.getItem('token');
      const timer = setTimeout(() => {
        fetch(`${API_BASE_URL}/api/v1/users/wishlist`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ wishlist })
        }).catch(err => console.error('Error updating backend wishlist:', err));
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [wishlist, user, hasFetchedWishlist]);

  const addToWishlist = (product) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.find((item) => item.id === product.id);
      if (exists) return prevWishlist;
      return [...prevWishlist, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== productId));
  };

  const toggleWishlist = (product) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.find((item) => item.id === product.id);
      if (exists) {
        return prevWishlist.filter((item) => item.id !== product.id);
      }
      return [...prevWishlist, product];
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  // Reset fetch tracker and clear wishlist when user logs out
  useEffect(() => {
    if (!user) {
      setHasFetchedWishlist(false);
      setWishlist([]);
    }
  }, [user]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
