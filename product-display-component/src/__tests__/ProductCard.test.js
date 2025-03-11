import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../components/ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    title: 'Test Product',
    price: 99.99,
    image: 'test-image.jpg',
    available: true
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
    
    const availabilityBadge = screen.getByTestId('availability-badge');
    expect(availabilityBadge).toBeInTheDocument();
    expect(availabilityBadge).toHaveClass('available');
    expect(availabilityBadge).toHaveTextContent('Available');
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

  it('displays unavailable badge when product is not available', () => {
    const unavailableProduct = { ...mockProduct, available: false };
    render(<ProductCard product={unavailableProduct} />);
    
    const availabilityBadge = screen.getByTestId('availability-badge');
    expect(availabilityBadge).toBeInTheDocument();
    expect(availabilityBadge).toHaveClass('unavailable');
    expect(availabilityBadge).toHaveTextContent('Unavailable');
  });

  it('defaults to available when available field is not provided', () => {
    const productWithoutAvailability = {
      id: 2,
      title: 'Another Product',
      price: 49.99,
      image: 'another-image.jpg'
    };
    render(<ProductCard product={productWithoutAvailability} />);
    
    const availabilityBadge = screen.getByTestId('availability-badge');
    expect(availabilityBadge).toBeInTheDocument();
    expect(availabilityBadge).toHaveClass('available');
    expect(availabilityBadge).toHaveTextContent('Available');
  });
});
