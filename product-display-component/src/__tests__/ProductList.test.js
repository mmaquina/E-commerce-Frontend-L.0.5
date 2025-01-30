import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductList from '../components/ProductList';
import useProducts from '../hooks/useProducts';

// Mock the useProducts hook
jest.mock('../hooks/useProducts');

describe('ProductList', () => {
  const mockProducts = [
    { id: 1, title: 'Product 1', price: 10.99, image: 'image1.jpg' },
    { id: 2, title: 'Product 2', price: 20.99, image: 'image2.jpg' }
  ];

  const mockUseProducts = {
    products: mockProducts,
    loading: false,
    error: null,
    fetchProducts: jest.fn(),
    fetchProductById: jest.fn()
  };

  beforeEach(() => {
    useProducts.mockReturnValue(mockUseProducts);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches products on mount', () => {
    render(<ProductList onProductSelect={() => {}} />);
    expect(mockUseProducts.fetchProducts).toHaveBeenCalled();
  });

  it('renders loading state correctly', () => {
    useProducts.mockReturnValue({
      ...mockUseProducts,
      loading: true,
      products: []
    });

    render(<ProductList onProductSelect={() => {}} />);
    const loadingCards = screen.getAllByTestId('product-card');
    expect(loadingCards).toHaveLength(6);
    loadingCards.forEach(card => {
      expect(card).toHaveClass('loading');
    });
  });

  it('renders error state correctly', () => {
    const errorMessage = 'Failed to fetch products';
    useProducts.mockReturnValue({
      ...mockUseProducts,
      error: errorMessage,
      products: []
    });

    render(<ProductList onProductSelect={() => {}} />);
    expect(screen.getByTestId('product-list-error')).toHaveTextContent(errorMessage);
  });

  it('renders products correctly', () => {
    render(<ProductList onProductSelect={() => {}} />);
    
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('$10.99')).toBeInTheDocument();
    expect(screen.getByText('$20.99')).toBeInTheDocument();
  });

  it('handles product selection correctly', () => {
    const mockOnProductSelect = jest.fn();
    render(<ProductList onProductSelect={mockOnProductSelect} />);
    
    const firstProduct = screen.getAllByTestId('product-card')[0];
    fireEvent.click(firstProduct);
    
    expect(mockOnProductSelect).toHaveBeenCalledWith(1);
  });
});