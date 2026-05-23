import React, { createContext, useContext } from 'react';
import useFetch from '../hooks/useFetch';
import { API_BASE_URL } from '../lib/config';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const { data, loading, error } = useFetch(`${API_BASE_URL}/api/v1/products`);

  // Normalize response data: extract products list from pagination wrapper, fallback to empty array
  const products = data && typeof data === 'object' && Array.isArray(data.products)
    ? data.products
    : (Array.isArray(data) ? data : []);

  return (
    <ProductContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};
