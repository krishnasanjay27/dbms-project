'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function BloodPage() {
  const [form, setForm] = useState({ name: '', bloodGroup: '', contact: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', bloodGroup: '', contact: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-100 p-6 space-y-12">
      <motion.h1
        className="text-4xl font-bold text-center text-rose-600 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🩸 Blood & Donor Services
      </motion.h1>

      {/* Call to Action */}
      <motion.div
        className="bg-rose-500 text-white p-6 rounded-xl shadow-xl text-center text-lg font-medium max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        🚨 Every 2 seconds someone needs blood. Your donation can save lives. Become a hero today!
      </motion.div>

      {/* Blood Compatibility */}
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-lg max-w-5xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-rose-500">🧬 Blood Group Compatibility</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-center text-gray-700 font-medium">
          <div className="bg-rose-50 p-4 rounded-xl">A+ ➜ A+, AB+</div>
          <div className="bg-rose-50 p-4 rounded-xl">A- ➜ A±, AB±</div>
          <div className="bg-rose-100 p-4 rounded-xl font-bold">O− ➜ All Types</div>
          <div className="bg-rose-50 p-4 rounded-xl">O+ ➜ A+, B+, AB+, O+</div>
          <div className="bg-rose-50 p-4 rounded-xl">B+ ➜ B+, AB+</div>
          <div className="bg-rose-50 p-4 rounded-xl">B− ➜ B±, AB±</div>
          <div className="bg-rose-50 p-4 rounded-xl">AB+ ➜ AB+</div>
          <div className="bg-rose-50 p-4 rounded-xl">AB− ➜ AB±</div>
        </div>
      </motion.div>

      {/* Donor Form */}
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-xl max-w-xl mx-auto relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-rose-600 text-center">🙋 Register as a Donor</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            required
            placeholder="👤 Full Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-300"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="text"
            required
            placeholder="🩸 Blood Group (e.g., B+)"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-300"
            value={form.bloodGroup}
            onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
          />
          <input
            type="text"
            required
            placeholder="📞 Contact Number"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-300"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
          />
          <button
            type="submit"
            className="w-full bg-rose-500 text-white py-3 rounded-xl font-semibold hover:bg-rose-600 transition duration-300"
          >
            ✅ Submit Registration
          </button>
        </form>

        {/* Success Popup */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white bg-opacity-90 rounded-2xl flex flex-col items-center justify-center text-green-600 font-bold"
            >
              <CheckCircle2 className="w-12 h-12 mb-2" />
              Thank you for registering! ❤️
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
