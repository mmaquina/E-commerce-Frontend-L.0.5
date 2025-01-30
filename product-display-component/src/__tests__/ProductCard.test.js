import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../components/ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    title: 'Test Product',
    price: 99.99,
    image: 'test-image.jpg'
  };

  it('renders loading state correctly', () => {
    render(<ProductCard loading={true} />);
    expect(screen.getByTestId('product-card')).toHaveClass('loading');
    expect(screen.getByTestId('product-image-placeholder')).toBeInTheDocument();
    expect(screen.getByTestId('product-info-placeholder')).toBeInTheDocument();
  });

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    
    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.jpg');
  });

  it('handles click events correctly', () => {
    const mockOnClick = jest.fn();
    render(<ProductCard product={mockProduct} onClick={mockOnClick} />);
    
    fireEvent.click(screen.getByTestId('product-card'));
    expect(mockOnClick).toHaveBeenCalledWith(mockProduct);
  });

  it('returns null when no product is provided and not loading', () => {
    const { container } = render(<ProductCard />);
    expect(container.firstChild).toBeNull();
  });
});