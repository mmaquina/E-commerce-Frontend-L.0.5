import React from 'react';
import useProducts from '../../hooks/useProducts';
import './styles.css';

// PUBLIC_INTERFACE
/**
 * Component for filtering and sorting products
 */
const ProductFilter = () => {
  const { filters, updateFilters, resetFilters } = useProducts();

  const handleSearchChange = (e) => {
    updateFilters({ searchQuery: e.target.value });
  };

  const handleCategoryChange = (e) => {
    updateFilters({ category: e.target.value });
  };

  const handlePriceChange = (type) => (e) => {
    updateFilters({
      priceRange: {
        ...filters.priceRange,
        [type]: e.target.value
      }
    });
  };

  const handleSortChange = (e) => {
    updateFilters({ sortBy: e.target.value });
  };

  return (
    <div className="product-filter">
      <div className="filter-section">
        <label htmlFor="search-input">Search Products</label>
        <input
          id="search-input"
          type="text"
          placeholder="Enter product name..."
          value={filters.searchQuery}
          onChange={handleSearchChange}
          className="search-input"
          aria-label="Search products"
        />
      </div>

      <div className="filter-section">
        <label htmlFor="category-select">Category</label>
        <select
          id="category-select"
          value={filters.category}
          onChange={handleCategoryChange}
          className="category-select"
          aria-label="Select category"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
          <option value="home">Home & Garden</option>
        </select>
      </div>

      <div className="filter-section price-range">
        <label>Price Range</label>
        <div className="price-inputs">
          <div className="price-input-group">
            <input
              id="min-price"
              type="number"
              placeholder="Min"
              value={filters.priceRange.min}
              onChange={handlePriceChange('min')}
              className="price-input"
              aria-label="Minimum price"
              min="0"
            />
            <label htmlFor="min-price" className="sr-only">Minimum price</label>
          </div>
          <span className="price-separator">to</span>
          <div className="price-input-group">
            <input
              id="max-price"
              type="number"
              placeholder="Max"
              value={filters.priceRange.max}
              onChange={handlePriceChange('max')}
              className="price-input"
              aria-label="Maximum price"
              min="0"
            />
            <label htmlFor="max-price" className="sr-only">Maximum price</label>
          </div>
        </div>
      </div>

      <div className="filter-section">
        <label htmlFor="sort-select">Sort By</label>
        <select
          id="sort-select"
          value={filters.sortBy}
          onChange={handleSortChange}
          className="sort-select"
          aria-label="Sort products"
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>

      <div className="filter-section">
        <button 
          onClick={resetFilters} 
          className="clear-filters"
          aria-label="Clear all filters"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;
