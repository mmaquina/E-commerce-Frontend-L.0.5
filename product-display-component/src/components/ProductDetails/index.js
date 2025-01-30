import React, { useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import './styles.css';

// PUBLIC_INTERFACE
/**
 * ProductDetails component displays detailed information about a selected product
 * @param {Object} props - Component props
 * @param {string} props.productId - ID of the product to display
 */
const ProductDetails = ({ productId }) => {
  const { selectedProduct, loading, error, fetchProductById } = useProducts();

  useEffect(() => {
    if (productId) {
      fetchProductById(productId);
    }
  }, [productId, fetchProductById]);

  if (error) {
    return (
      <div className="product-details">
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="product-details">
        <div className="product-details-container">
          <div className="skeleton skeleton-image" data-testid="skeleton-image" />
          <div className="product-info">
            <div className="skeleton skeleton-text skeleton-title" data-testid="skeleton-title" />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text skeleton-price" data-testid="skeleton-price" />
            <div className="skeleton skeleton-text skeleton-description" data-testid="skeleton-description" />
          </div>
        </div>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="product-details">
        <div className="error-message">
          Product not found
        </div>
      </div>
    );
  }

  const { title, price, description, category, image } = selectedProduct;

  return (
    <div className="product-details">
      <div className="product-details-container">
        <div className="product-image-container">
          <img 
            src={image} 
            alt={title} 
            className="product-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x400?text=Product+Image+Not+Available';
              e.target.classList.add('image-error');
            }}
            onLoad={(e) => {
              e.target.classList.add('image-loaded');
            }}
          />
          <div className="image-loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        </div>
        <div className="product-info">
          <h1 className="product-title">{title}</h1>
          <p className="product-category">{category}</p>
          <p className="product-price">${price.toFixed(2)}</p>
          <p className="product-description">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
