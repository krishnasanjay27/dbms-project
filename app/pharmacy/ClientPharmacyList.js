"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, PhoneCall, Clock } from "lucide-react";

const ClientPharmacyList = ({ pharmacies }) => {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-50 to-pink-50">
      <motion.h2
        className="text-4xl font-extrabold text-purple-700 mb-8 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🏥 Find Nearby Pharmacies
      </motion.h2>

      <motion.div
        className="mb-8 text-center text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p>Explore trusted pharmacies near you. More filters and maps coming soon!</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {pharmacies.map((pharmacy, index) => (
          <motion.div
            key={pharmacy.Pharmacy_ID}
            className="bg-white border border-purple-200 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <div className="flex items-center gap-2 mb-3 text-purple-700">
              <MapPin size={22} />
              <h3 className="text-xl font-bold">{pharmacy.Pharmacy_name}</h3>
            </div>
            <p className="text-gray-700 mb-1">
              📍 <strong>Location:</strong> {pharmacy.Location}
            </p>
            <p className="text-gray-700 mb-1">
              📞 <strong>Contact:</strong> {pharmacy.Contact || "N/A"}
            </p>
            <p className="text-gray-700 mb-1">
              ⏰ <strong>Hours:</strong> {pharmacy.Operating_hours}
            </p>
            <div className="mt-4 text-sm text-purple-500 italic">
              Stock status and directions coming soon!
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center text-purple-500 text-sm">
        🗺️ Map-based search, filters by stock, and emergency availability coming soon to enhance your experience!
      </div>
    </div>
  );
};

export default ClientPharmacyList;
