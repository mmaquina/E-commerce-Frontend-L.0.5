import { get, handleApiError } from './api';

// PUBLIC_INTERFACE
/**
 * Fetches all products
 * @param {Object} params - Query parameters for filtering and pagination
 * @returns {Promise<Array>} - Array of products
 */
export const getProducts = async (params = {}) => {
  try {
    return await get('/products', params);
  } catch (error) {
    return handleApiError(error);
  }
};

// PUBLIC_INTERFACE
/**
 * Fetches a single product by ID
 * @param {string} productId - The ID of the product to fetch
 * @returns {Promise<Object>} - Product details
 */
export const getProductById = async (productId) => {
  try {
    return await get(`/products/${productId}`);
  } catch (error) {
    return handleApiError(error);
  }
};

// PUBLIC_INTERFACE
/**
 * Fetches products by category
 * @param {string} category - The category to filter by
 * @param {Object} params - Additional query parameters
 * @returns {Promise<Array>} - Array of products in the category
 */
export const getProductsByCategory = async (category, params = {}) => {
  try {
    return await get(`/products/category/${category}`, params);
  } catch (error) {
    return handleApiError(error);
  }
};