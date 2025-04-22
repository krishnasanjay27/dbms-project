'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Toaster, toast } from 'react-hot-toast';
import SearchResults from '../components/SearchResults';
import FilterOptions from '../components/FilterOptions';
import FilteredPharmacies from '../components/FilteredPharmacies';

export default function SearchPage() {
  const { data: session, status } = useSession();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for filtered search
  const [isFiltered, setIsFiltered] = useState(false);
  const [filteredResults, setFilteredResults] = useState({
    medicine: null,
    pharmacies: []
  });
  const [activeFilters, setActiveFilters] = useState({
    minStock: 1,
    minPrice: 0,
    maxPrice: 1000
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    try {
      setIsLoading(true);
      setIsFiltered(false);
      const response = await fetch(`/api/search?query=${encodeURIComponent(query.trim())}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Error searching:', error);
      toast.error('Search failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilters = async (filters) => {
    if (!query.trim()) return;
    
    try {
      setIsLoading(true);
      setActiveFilters(filters);
      
      const response = await fetch(
        `/api/filter-pharmacies?medicineName=${encodeURIComponent(query.trim())}&minStock=${filters.minStock}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}`
      );
      
      if (!response.ok) {
        throw new Error('Filter search failed');
      }
      
      const data = await response.json();
      console.log('Filtered data received:', data);
      
      if (!data.medicine) {
        toast.error('No medicine found with this name');
        setIsFiltered(false);
        return;
      }
      
      // Ensure pharmacies is an array
      const pharmacies = Array.isArray(data.pharmacies) ? data.pharmacies : 
                         (data.pharmacies ? [data.pharmacies] : []);
      
      setFilteredResults({
        medicine: data.medicine,
        pharmacies: pharmacies
      });
      setIsFiltered(true);
    } catch (error) {
      console.error('Error filtering:', error);
      toast.error('Filter failed: ' + error.message);
      setIsFiltered(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Toaster position="top-center" />
      
      <div className="flex justify-between items-center mb-6">
      <motion.h1
        className="text-2xl font-bold text-green-800 mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >💊 Find Your Medicine</motion.h1>
        
        {status === 'loading' ? (
          <div className="text-sm">Loading...</div>
        ) : session ? (
          <div className="flex items-center space-x-2">
            <span className="text-sm">Hello, {session.user.name}</span>
            <img 
              src={session.user.image || '/placeholder-avatar.png'} 
              alt={session.user.name} 
              className="w-8 h-8 rounded-full"
            />
          </div>
        ) : (
          <button 
            onClick={() => signIn('google')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Sign In
          </button>
        )}
      </div>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for medicines..."
            className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md disabled:bg-blue-300"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
      
      {query.trim() && !isLoading && (
        <FilterOptions 
          onApplyFilters={handleApplyFilters} 
          isLoading={isLoading} 
        />
      )}
      
      {isLoading ? (
        <div className="text-center py-8">
          <p>Searching...</p>
        </div>
      ) : isFiltered ? (
        <FilteredPharmacies 
          medicine={filteredResults.medicine} 
          pharmacies={filteredResults.pharmacies} 
        />
      ) : (
        <SearchResults results={results} />
      )}

      <div className="mt-8 text-xs text-gray-500">
        <p>Need help? Use the filters above to find pharmacies with specific price ranges and stock availability.</p>
      </div>
    </div>
  );
}