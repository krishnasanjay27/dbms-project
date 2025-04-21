import { useState, useEffect } from 'react';

export default function FilterOptions({ onApplyFilters, isLoading }) {
  const [minStock, setMinStock] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [showFilters, setShowFilters] = useState(false);

  const handleApplyFilters = () => {
    onApplyFilters({
      minStock,
      minPrice,
      maxPrice
    });
  };

  const handleResetFilters = () => {
    setMinStock(1);
    setMinPrice(0);
    setMaxPrice(1000);
    onApplyFilters({
      minStock: 1,
      minPrice: 0,
      maxPrice: 1000
    });
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">Filter Options</h3>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="text-blue-500 text-sm"
        >
          {showFilters ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      {showFilters && (
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Stock
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={minStock}
              onChange={(e) => setMinStock(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>{minStock}</span>
              <span>50</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range (₹)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                max={maxPrice - 1}
                value={minPrice}
                onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
                className="w-1/4 border rounded-md p-1"
              />
              <span>to</span>
              <input
                type="number"
                min={minPrice + 1}
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value) || minPrice + 1)}
                className="w-1/4 border rounded-md p-1"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={handleResetFilters}
              className="px-3 py-1 border rounded-md hover:bg-gray-100"
            >
              Reset
            </button>
            <button
              onClick={handleApplyFilters}
              disabled={isLoading}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isLoading ? 'Applying...' : 'Apply Filters'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 