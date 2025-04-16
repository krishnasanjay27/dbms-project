'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import SearchBox from './SearchBox';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchedOnce, setSearchedOnce] = useState(false);
  const [pharmacyList, setPharmacyList] = useState([]);

  const handleSearch = async () => {
    setLoading(true);
    setSearchedOnce(true);
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResults(data.results);
      setError('');
    } catch (err) {
      console.error('Error:', err);
      setError('⚠️ ' + (err.message || 'Something went wrong. Please try again.'));
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPharmacies = async (medicineName) => {
    try {
      const res = await fetch(`/api/medicine-pharmacies?medicine=${encodeURIComponent(medicineName)}`);
      const data = await res.json();
      setPharmacyList(data.pharmacies || []);
    } catch (err) {
      console.error('Error fetching pharmacies:', err);
    }
  };

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setPharmacyList([]);
      return;
    }
    handleSearch();
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-white">
      <motion.h1
        className="text-4xl font-bold text-green-700 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        💊 Find Your Medicine
      </motion.h1>

      <SearchBox onSelect={(value) => setQuery(value?.trim() || '')} />

      {loading && <div className="mt-4 text-green-600">Searching...</div>}

      {error && (
        <motion.p className="text-red-500 mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {error}
        </motion.p>
      )}

      {results.length > 0 && (
        <motion.ul
          className="mt-6 space-y-4 w-full max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {results.map((item, idx) => (
            <motion.li
              key={idx}
              className="border p-4 rounded-xl shadow hover:shadow-lg transition bg-white cursor-pointer"
              whileHover={{ y: -3 }}
              onClick={() => fetchPharmacies(item.name)}
            >
              <p className="text-lg font-semibold text-green-800">🧪 {item.name}</p>
              <p className="text-gray-700">💰 Price: ₹{item.price}</p>
            </motion.li>
          ))}
        </motion.ul>
      )}

      {results.length === 0 && !error && !loading && !query && searchedOnce && (
        <motion.div
          className="mt-12 text-center text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>Enter a medicine name to search</p>
          <p className="text-sm mt-2">Try searching for "paracetamol" or "aspirin"</p>
          <p className="text-sm mt-1">Or click the search button with empty query to see all medicines</p>
        </motion.div>
      )}

      {pharmacyList.length > 0 && (
        <div className="mt-10 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-2 text-green-700">Pharmacies with this medicine:</h3>
          <ul className="space-y-3">
            {pharmacyList.map((pharm, idx) => (
              <li key={idx} className="p-3 bg-white shadow rounded-lg">
                <p className="font-medium text-green-800">🏥 {pharm.pharmacy}</p>
                <p className="text-sm text-gray-700">📍 {pharm.location}</p>
                <p className="text-sm text-gray-700">📞 {pharm.contact || 'N/A'}</p>
                <p className="text-sm text-gray-700">📦 Stock: {pharm.quantity} units</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
