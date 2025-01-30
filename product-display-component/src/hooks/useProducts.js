import { useContext } from 'react';
import { ProductContext } from '../context/ProductContext';

// PUBLIC_INTERFACE
/**
 * Custom hook for accessing product-related state and operations
 * @returns {Object} Product context value containing state and methods
 */
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export default useProducts;