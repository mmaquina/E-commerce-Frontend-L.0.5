import React, { useEffect } from 'react';
import useProducts from '../../hooks/useProducts';
import ProductCard from '../ProductCard';
import ProductFilter from '../ProductFilter';
import './styles.css';

// PUBLIC_INTERFACE
/**
 * Component for displaying a grid of product cards
 * @param {Object} props - Component props
 * @param {Function} props.onProductSelect - Callback function when a product is selected
 */
const ProductList = ({ onProductSelect }) => {
  const { products, loading, error, fetchProducts, fetchProductById } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleProductClick = (product) => {
    onProductSelect(product.id);
  };

  if (error) return <div className="product-list-error" data-testid="product-list-error">Error: {error}</div>;

  return (
    <div className="product-list-container">
      <ProductFilter />
      <div className="product-list">
      {loading ? (
        // Show loading placeholders
        Array.from({ length: 6 }).map((_, index) => (
          <ProductCard key={`loading-${index}`} loading={true} />
        ))
      ) : (
        // Show actual products
        products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={handleProductClick}
          />
        ))
      )}
      </div>
    </div>
  );
};

export default ProductList;
