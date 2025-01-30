// Base API configuration for the e-commerce application
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://8000_172_31_46_215.workspace.develop.kavia.ai';

// PUBLIC_INTERFACE
/**
 * Makes a GET request to the API
 * @param {string} endpoint - The API endpoint to call
 * @param {Object} params - Query parameters
 * @returns {Promise<any>} - The API response
 */
export const get = async (endpoint, params = {}, token) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;
  const response = await fetch(url, {
    method: "GET", 
    headers: {
      "Authorization": `Bearer ${token}`,  
      "Content-Type": "application/json",
    }});
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  return response.json();
};

// PUBLIC_INTERFACE
/**
 * Makes a POST request to the API
 * @param {string} endpoint - The API endpoint to call
 * @param {Object} data - The data to send
 * @returns {Promise<any>} - The API response
 */
export const post = async (endpoint, data) => {

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  return response.json();
};

// Error handling utilities
export const handleApiError = (error) => {
  console.error('API Error:', error);
  throw error;
};
