import React, { useState } from 'react';
import './styles.css';

// PUBLIC_INTERFACE
/**
 * ProductCard component displays individual product information
 * @param {Object} props - Component props
 * @param {Object} props.product - Product data object
 * @param {string} props.product.image - Product image URL
 * @param {string} props.product.title - Product title
 * @param {number} props.product.price - Product price
 * @param {boolean} props.product.available - Product availability status
 * @param {Function} props.onClick - Click handler for product selection
 * @param {boolean} props.loading - Loading state flag
 * @param {string} [props.currencySymbol='$'] - Currency symbol to display before price
 */
const ProductCard = ({ product, onClick, loading, currencySymbol = '$' }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  if (loading) {
    return (
      <div className="product-card loading" data-testid="product-card">
        <div className="product-image-placeholder" data-testid="product-image-placeholder"></div>
        <div className="product-info-placeholder" data-testid="product-info-placeholder">
          <div className="title-placeholder"></div>
          <div className="product-details-placeholder">
            <div className="price-placeholder"></div>
            <div className="availability-placeholder"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const { image, title, price, available = true } = product;

  const handleClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  return (
    <div className="product-card" onClick={handleClick} data-testid="product-card">
      <div className="product-image">
        {imageError ? (
          <div className="image-error">
            <span>Unable to load image</span>
          </div>
        ) : (
          <img
            src={image}
            alt={title}
            loading="lazy"
            className={imageLoaded ? 'loaded' : 'loading'}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="product-info">
        <h3 className="product-title">{title}</h3>
        <div className="product-details">
          <p className="product-price">
            {currencySymbol}{typeof price === 'number' ? price.toFixed(2) : '0.00'}
          </p>
          <div className={`availability-badge ${available ? 'available' : 'unavailable'}`} data-testid="availability-badge">
            {available ? 'Available' : 'Unavailable'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
