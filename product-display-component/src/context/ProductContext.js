import React, { createContext, useState, useCallback, useMemo } from 'react';
import { getProducts, getProductById, getProductsByCategory } from '../services/productService';

export const ProductContext = createContext();

const initialFilters = {
  priceRange: { min: '', max: '' },
  category: '',
  searchQuery: '',
  sortBy: 'name-asc' // Default sort
};

// PUBLIC_INTERFACE
/**
 * Provider component for product-related state and operations
 */
export const ProductProvider = ({ children, token }) => {
  const authToken=token
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const fetchProducts = useCallback(async (params = {}, token=authToken) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts(params, token);
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductById = useCallback(async (productId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProductById(productId);
      setSelectedProduct(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductsByCategory = useCallback(async (category, params) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProductsByCategory(category, params);
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.category) {
      result = result.filter(product => product.category === filters.category);
    }

    // Apply price range filter
    if (filters.priceRange.min !== '') {
      result = result.filter(product => product.price >= Number(filters.priceRange.min));
    }
    if (filters.priceRange.max !== '') {
      result = result.filter(product => product.price <= Number(filters.priceRange.max));
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'name-asc':
      default:
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [products, filters]);

  const value = {
    products: filteredAndSortedProducts,
    loading,
    error,
    selectedProduct,
    filters,
    updateFilters,
    resetFilters,
    fetchProducts,
    fetchProductById,
    fetchProductsByCategory,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
