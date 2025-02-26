import { useState } from 'react';
import './App.css';
import { ProductProvider } from './context/ProductContext';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';

function App() {
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleProductSelect = (productId) => {
    setSelectedProductId(productId);
  };

  return (
    <ProductProvider>
      <div className="App">
        <h1>Product Display Component</h1>
        {selectedProductId ? (
          <>
            <button 
              onClick={() => setSelectedProductId(null)}
              className="back-button"
            >
              Back to Products
            </button>
            <ProductDetails productId={selectedProductId} />
          </>
        ) : (
          <ProductList onProductSelect={handleProductSelect} />
        )}
      </div>
    </ProductProvider>
  );
}

export default App;
