'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Phone, Droplet, AlertTriangle, CheckCircle2 } from 'lucide-react';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function BloodPage() {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalAvailable, setTotalAvailable] = useState(0);

  const searchBloodBanks = async (bloodGroup) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/blood/search?group=${encodeURIComponent(bloodGroup)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch blood banks');
      }
      const data = await response.json();
      setBloodBanks(data.bloodBanks || []);
      setTotalAvailable(data.totalAvailable || 0);
    } catch (err) {
      setError(err.message);
      setBloodBanks([]);
      setTotalAvailable(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBloodGroup) {
      searchBloodBanks(selectedBloodGroup);
    }
  }, [selectedBloodGroup]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-indigo-600 mb-4">🩸 Blood Bank Search</h1>
          <p className="text-gray-600">Find blood availability in nearby blood banks</p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-indigo-600 mb-4">Select Blood Group</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {bloodGroups.map((group) => (
              <button
                key={group}
                onClick={() => setSelectedBloodGroup(group)}
                className={`p-3 rounded-lg text-center font-medium transition-all duration-300 ${
                  selectedBloodGroup === group
                    ? 'bg-indigo-500 text-white shadow-lg transform scale-105'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:shadow-md'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {loading && (
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              className="bg-red-50 p-4 rounded-lg flex items-center text-red-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              {error}
            </motion.div>
          )}

          {!loading && !error && selectedBloodGroup && totalAvailable === 0 && (
            <motion.div
              className="bg-yellow-50 p-4 rounded-lg flex items-center text-yellow-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              No blood banks currently have {selectedBloodGroup} blood in stock.
            </motion.div>
          )}

          {!loading && !error && totalAvailable > 0 && (
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3 className="text-xl font-semibold text-indigo-600 mb-4">
                {totalAvailable} Blood Bank{totalAvailable > 1 ? 's' : ''} with {selectedBloodGroup} Available
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bloodBanks.map((bank, index) => (
                  <motion.div
                    key={index}
                    className="border p-4 rounded-lg hover:shadow-md transition-all duration-300 bg-indigo-50"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h4 className="font-semibold text-indigo-700">{bank.name}</h4>
                    <div className="mt-2 space-y-2">
                      <p className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                        {bank.location}
                      </p>
                      <p className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-indigo-500" />
                        {bank.contact}
                      </p>
                      <p className="flex items-center text-sm text-gray-600">
                        <Droplet className="w-4 h-4 mr-2 text-indigo-500" />
                        Available Units: {bank.availableUnits}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}