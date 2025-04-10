'use client';

import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-6">
      <motion.h1
        className="text-5xl font-extrabold mb-10 text-gray-800 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to <span className="text-purple-600">MediConnect</span>
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <a
          href="/search"
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-5 rounded-2xl shadow-lg transform hover:scale-105 transition duration-300 flex flex-col items-center"
        >
          🔍
          <span className="mt-2 text-lg font-semibold">Search Medicines</span>
        </a>

        <a
          href="/blood"
          className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white px-6 py-5 rounded-2xl shadow-lg transform hover:scale-105 transition duration-300 flex flex-col items-center"
        >
          🩸
          <span className="mt-2 text-lg font-semibold">Blood & Donor Services</span>
        </a>

        <a
          href="/pharmacy"
          className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white px-6 py-5 rounded-2xl shadow-lg transform hover:scale-105 transition duration-300 flex flex-col items-center"
        >
          📍
          <span className="mt-2 text-lg font-semibold">Locate Pharmacies</span>
        </a>
      </motion.div>

      <p className="mt-10 text-gray-600 text-center max-w-xl">
        Easily find medicines, locate nearby pharmacies, or connect with blood donors – all in one place.
      </p>
    </div>
  );
}
