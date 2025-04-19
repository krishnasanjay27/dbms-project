'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Funnel } from 'lucide-react';
import SearchBox from './SearchBox';

export default function SearchPage() {
  const [selectedMed, setSelectedMed] = useState(null);
  const [pharmacyList, setPharmacyList] = useState([]);
  const [filters, setFilters] = useState({ minQuantity: 0, maxPrice: 500 });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPharmacies = useCallback(async (medName, { minQuantity, maxPrice }) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        medicine: medName,
        minStock: String(minQuantity),
        maxPrice: String(maxPrice),
      });
      const res = await fetch(`/api/search/medicine-pharmacies?${params}`);
      if (!res.ok) throw new Error('Fetch error');
      const { pharmacies } = await res.json();
      setPharmacyList(pharmacies || []);
    } catch (err) {
      console.error(err);
      setError('Could not load pharmacies');
      setPharmacyList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const onSelectMedicine = (med) => {
    setSelectedMed(med);
    setFilters({ minQuantity: 0, maxPrice: 1000 }); // ← Reset filters here
    fetchPharmacies(med.name, { minQuantity: 0, maxPrice: 1000 }); // use default
  };
  

  const onApplyFilters = () => {
    if (!selectedMed) return;
    fetchPharmacies(selectedMed.name, filters);
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-green-50 p-8 flex flex-col items-center">
      <motion.h1
        className="text-5xl font-bold text-green-800 mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >💊 Find Your Medicine</motion.h1>

      <div className="w-full max-w-2xl mb-6">
        <SearchBox onSelect={onSelectMedicine} />
      </div>

      {selectedMed && (
        <div className="w-full max-w-2xl flex items-start mb-4 space-x-4">
          <div className="flex-1 bg-white p-4 rounded-xl shadow">
            <p className="font-semibold text-lg">{selectedMed.name}</p>
            <p className="text-green-700">₹{selectedMed.price}</p>
          </div>

          <button
            onClick={() => setShowFilters(f => !f)}
            className="p-3 bg-white rounded-lg shadow hover:bg-gray-100 transition self-center"
          >
            <Funnel className={`h-6 w-6 ${showFilters ? 'text-blue-600' : 'text-gray-600'}`} />
          </button>
        </div>
      )}

      <AnimatePresence>
        {showFilters && selectedMed && (
          <motion.div
            className="w-full max-w-2xl bg-white p-6 rounded-xl shadow mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-gray-700">
                  Min Stock: <span className="text-green-800">{filters.minQuantity}</span>
                </label>
                <input
                  type="range" min="0" max="100"
                  value={filters.minQuantity}
                  onChange={e => setFilters(f => ({ ...f, minQuantity: +e.target.value }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">
                  Max Price: <span className="text-green-800">₹{filters.maxPrice}</span>
                </label>
                <input
                  type="range" min="0" max="1000" step="1"
                  value={filters.maxPrice}
                  onChange={e => setFilters(f => ({ ...f, maxPrice: +e.target.value }))}
                  className="w-full"
                />
              </div>
            </div>
            <button
              onClick={onApplyFilters}
              className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
              Apply Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="w-full max-w-md space-y-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white p-4 rounded-xl shadow">
              <div className="h-4 bg-gray-200 mb-2 rounded"></div>
              <div className="h-3 bg-gray-200 mb-2 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 w-1/2 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Pharmacies or "No Results" */}
      {!loading && selectedMed && (
        <div className="w-full max-w-2xl">
          {pharmacyList.length > 0 ? (
            <>
              <h2 className="text-2xl font-semibold text-green-800 mb-4">Pharmacies</h2>
              <ul className="space-y-4">
                {pharmacyList.map((p, i) => (
                  <li key={i} className="bg-white p-4 rounded-xl shadow">
                    <p className="font-medium">🏥 {p.pharmacy}</p>
                    <p className="text-sm text-gray-600">📍 {p.location}</p>
                    <p className="text-sm text-gray-600">📞 {p.contact}</p>
                    <p className="text-sm text-gray-600">⏰ {p.hours}</p>
                    <div className="mt-2 flex justify-between text-sm">
                      <span>📦 {p.quantity} units</span>
                      <span>₹{p.selling_price}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-gray-600 mt-6"
            >
              <p className="text-lg">😔 No pharmacies found for this medicine</p>
              <p className="text-sm">Try adjusting your filters or searching another medicine.</p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
