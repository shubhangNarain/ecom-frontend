import React, { createContext, useContext } from 'react';
import useFetch from '../hooks/useFetch';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const { data: products, loading, error } = useFetch('https://ecom-backend-dp5m.onrender.com/api/v1/products');

  return (
    <ProductContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};
