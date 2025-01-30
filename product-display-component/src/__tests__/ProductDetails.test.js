import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductDetails from '../components/ProductDetails';
import { ProductContext } from '../context/ProductContext';

// Mock product data
const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 99.99,
  description: 'Test product description',
  category: 'Test Category',
  image: 'test-image.jpg'
};

// Mock context values
const createMockContextValue = (overrides = {}) => ({
  selectedProduct: null,
  loading: false,
  error: null,
  fetchProductById: jest.fn(),
  ...overrides
});

// Test setup helper
const renderProductDetails = (contextValue, props = {}) => {
  return render(
    <ProductContext.Provider value={contextValue}>
      <ProductDetails {...props} />
    </ProductContext.Provider>
  );
};

describe('ProductDetails Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calls fetchProductById on mount with provided productId', () => {
    const mockFetchProductById = jest.fn();
    const contextValue = createMockContextValue({ fetchProductById: mockFetchProductById });
    
    renderProductDetails(contextValue, { productId: '1' });
    
    expect(mockFetchProductById).toHaveBeenCalledWith('1');
  });

  test('displays loading skeleton when loading is true', () => {
    const contextValue = createMockContextValue({ loading: true });
    
    renderProductDetails(contextValue, { productId: '1' });
    
    expect(screen.getByTestId('skeleton-image')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-title')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-price')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-description')).toBeInTheDocument();
  });

  test('displays error message when there is an error', () => {
    const errorMessage = 'Failed to fetch product';
    const contextValue = createMockContextValue({ error: errorMessage });
    
    renderProductDetails(contextValue, { productId: '1' });
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('displays "Product not found" when no product is selected', () => {
    const contextValue = createMockContextValue({ selectedProduct: null });
    
    renderProductDetails(contextValue, { productId: '1' });
    
    expect(screen.getByText('Product not found')).toBeInTheDocument();
  });

  test('displays product details when product is loaded successfully', () => {
    const contextValue = createMockContextValue({ selectedProduct: mockProduct });
    
    renderProductDetails(contextValue, { productId: '1' });
    
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByAltText(mockProduct.title)).toHaveAttribute('src', mockProduct.image);
  });

  test('handles image loading error by showing fallback image', async () => {
    const contextValue = createMockContextValue({ selectedProduct: mockProduct });
    
    renderProductDetails(contextValue, { productId: '1' });
    
    const img = screen.getByAltText(mockProduct.title);
    fireEvent.error(img);
    
    await waitFor(() => {
      expect(img).toHaveAttribute('src', 'https://via.placeholder.com/400x400?text=Product+Image+Not+Available');
    });
  });

  test('does not call fetchProductById when productId is not provided', () => {
    const mockFetchProductById = jest.fn();
    const contextValue = createMockContextValue({ fetchProductById: mockFetchProductById });
    
    renderProductDetails(contextValue, {});
    
    expect(mockFetchProductById).not.toHaveBeenCalled();
  });
});