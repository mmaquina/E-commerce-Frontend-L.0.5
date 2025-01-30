import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductFilter from '../components/ProductFilter';
import { ProductContext } from '../context/ProductContext';

// Mock data and setup
const mockUpdateFilters = jest.fn();
const mockResetFilters = jest.fn();
const defaultFilters = {
  searchQuery: '',
  category: '',
  priceRange: { min: '', max: '' },
  sortBy: 'name-asc'
};

const renderWithContext = (ui, { filters = defaultFilters } = {}) => {
  return render(
    <ProductContext.Provider
      value={{
        filters,
        updateFilters: mockUpdateFilters,
        resetFilters: mockResetFilters
      }}
    >
      {ui}
    </ProductContext.Provider>
  );
};

describe('ProductFilter Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Render State', () => {
    it('renders all filter elements correctly', () => {
      renderWithContext(<ProductFilter />);
      
      expect(screen.getByPlaceholder('Search products...')).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
      expect(screen.getByPlaceholder('Min Price')).toBeInTheDocument();
      expect(screen.getByPlaceholder('Max Price')).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /sort/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
    });

    it('displays default values for all inputs', () => {
      renderWithContext(<ProductFilter />);
      
      expect(screen.getByPlaceholder('Search products...')).toHaveValue('');
      expect(screen.getByRole('combobox', { name: /category/i })).toHaveValue('');
      expect(screen.getByPlaceholder('Min Price')).toHaveValue('');
      expect(screen.getByPlaceholder('Max Price')).toHaveValue('');
      expect(screen.getByRole('combobox', { name: /sort/i })).toHaveValue('name-asc');
    });
  });

  describe('Search Input Functionality', () => {
    it('updates search query on input change', async () => {
      renderWithContext(<ProductFilter />);
      const searchInput = screen.getByPlaceholder('Search products...');
      
      await userEvent.type(searchInput, 'test query');
      
      expect(mockUpdateFilters).toHaveBeenCalledWith({
        searchQuery: 'test query'
      });
    });

    it('reflects current search query from context', () => {
      renderWithContext(<ProductFilter />, {
        filters: { ...defaultFilters, searchQuery: 'existing search' }
      });
      
      expect(screen.getByPlaceholder('Search products...')).toHaveValue('existing search');
    });
  });

  describe('Category Selection', () => {
    it('updates category on selection change', () => {
      renderWithContext(<ProductFilter />);
      const categorySelect = screen.getByRole('combobox', { name: /category/i });
      
      fireEvent.change(categorySelect, { target: { value: 'electronics' } });
      
      expect(mockUpdateFilters).toHaveBeenCalledWith({
        category: 'electronics'
      });
    });

    it('displays all available category options', () => {
      renderWithContext(<ProductFilter />);
      const categorySelect = screen.getByRole('combobox', { name: /category/i });
      
      expect(categorySelect.children.length).toBe(5); // All Categories + 4 specific categories
      expect(categorySelect).toHaveDisplayValue('All Categories');
    });
  });

  describe('Price Range Filtering', () => {
    it('updates minimum price on input', () => {
      renderWithContext(<ProductFilter />);
      const minPriceInput = screen.getByPlaceholder('Min Price');
      
      fireEvent.change(minPriceInput, { target: { value: '10' } });
      
      expect(mockUpdateFilters).toHaveBeenCalledWith({
        priceRange: { ...defaultFilters.priceRange, min: '10' }
      });
    });

    it('updates maximum price on input', () => {
      renderWithContext(<ProductFilter />);
      const maxPriceInput = screen.getByPlaceholder('Max Price');
      
      fireEvent.change(maxPriceInput, { target: { value: '100' } });
      
      expect(mockUpdateFilters).toHaveBeenCalledWith({
        priceRange: { ...defaultFilters.priceRange, max: '100' }
      });
    });

    it('reflects current price range from context', () => {
      const customFilters = {
        ...defaultFilters,
        priceRange: { min: '20', max: '200' }
      };
      renderWithContext(<ProductFilter />, { filters: customFilters });
      
      expect(screen.getByPlaceholder('Min Price')).toHaveValue('20');
      expect(screen.getByPlaceholder('Max Price')).toHaveValue('200');
    });
  });

  describe('Sort Order Selection', () => {
    it('updates sort order on selection change', () => {
      renderWithContext(<ProductFilter />);
      const sortSelect = screen.getByRole('combobox', { name: /sort/i });
      
      fireEvent.change(sortSelect, { target: { value: 'price-desc' } });
      
      expect(mockUpdateFilters).toHaveBeenCalledWith({
        sortBy: 'price-desc'
      });
    });

    it('displays all available sorting options', () => {
      renderWithContext(<ProductFilter />);
      const sortSelect = screen.getByRole('combobox', { name: /sort/i });
      
      expect(sortSelect.children.length).toBe(4);
      expect(Array.from(sortSelect.children).map(option => option.value))
        .toEqual(['name-asc', 'name-desc', 'price-asc', 'price-desc']);
    });
  });

  describe('Filter Reset Functionality', () => {
    it('calls resetFilters when clear button is clicked', () => {
      renderWithContext(<ProductFilter />);
      const clearButton = screen.getByRole('button', { name: /clear filters/i });
      
      fireEvent.click(clearButton);
      
      expect(mockResetFilters).toHaveBeenCalledTimes(1);
    });

    it('resets all inputs to default values after reset', () => {
      const customFilters = {
        searchQuery: 'test',
        category: 'electronics',
        priceRange: { min: '10', max: '100' },
        sortBy: 'price-desc'
      };
      
      const { rerender } = renderWithContext(<ProductFilter />, { filters: customFilters });
      
      // Verify initial custom values
      expect(screen.getByPlaceholder('Search products...')).toHaveValue('test');
      expect(screen.getByRole('combobox', { name: /category/i })).toHaveValue('electronics');
      
      // Simulate reset by re-rendering with default filters
      rerender(
        <ProductContext.Provider
          value={{
            filters: defaultFilters,
            updateFilters: mockUpdateFilters,
            resetFilters: mockResetFilters
          }}
        >
          <ProductFilter />
        </ProductContext.Provider>
      );
      
      // Verify reset values
      expect(screen.getByPlaceholder('Search products...')).toHaveValue('');
      expect(screen.getByRole('combobox', { name: /category/i })).toHaveValue('');
      expect(screen.getByPlaceholder('Min Price')).toHaveValue('');
      expect(screen.getByPlaceholder('Max Price')).toHaveValue('');
      expect(screen.getByRole('combobox', { name: /sort/i })).toHaveValue('name-asc');
    });
  });

  describe('Combined Filter Operations', () => {
    it('maintains multiple filter values when updating individual filters', () => {
      const initialFilters = {
        searchQuery: 'test',
        category: 'electronics',
        priceRange: { min: '10', max: '100' },
        sortBy: 'price-desc'
      };
      
      renderWithContext(<ProductFilter />, { filters: initialFilters });
      
      const searchInput = screen.getByPlaceholder('Search products...');
      fireEvent.change(searchInput, { target: { value: 'new search' } });
      
      expect(mockUpdateFilters).toHaveBeenCalledWith({
        searchQuery: 'new search'
      });
      
      // Original values should remain unchanged in the UI
      expect(screen.getByRole('combobox', { name: /category/i })).toHaveValue('electronics');
      expect(screen.getByPlaceholder('Min Price')).toHaveValue('10');
      expect(screen.getByPlaceholder('Max Price')).toHaveValue('100');
      expect(screen.getByRole('combobox', { name: /sort/i })).toHaveValue('price-desc');
    });
  });

  describe('Invalid Input Handling', () => {
    it('handles negative price inputs correctly', () => {
      renderWithContext(<ProductFilter />);
      const minPriceInput = screen.getByPlaceholder('Min Price');
      
      fireEvent.change(minPriceInput, { target: { value: '-10' } });
      
      expect(mockUpdateFilters).toHaveBeenCalledWith({
        priceRange: { ...defaultFilters.priceRange, min: '-10' }
      });
    });

    it('handles non-numeric price inputs', () => {
      renderWithContext(<ProductFilter />);
      const maxPriceInput = screen.getByPlaceholder('Max Price');
      
      fireEvent.change(maxPriceInput, { target: { value: 'abc' } });
      
      // The native number input should prevent non-numeric input
      expect(maxPriceInput.value).toBe('');
    });
  });
});