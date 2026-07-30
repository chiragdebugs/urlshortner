'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Clock, Zap, KeyRound } from 'lucide-react';

export default function SecuritySection() {
  return (
    <section id="security" className="py-20 bg-gray-50/60 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-bold text-[#635BFF] uppercase tracking-wider">
            Enterprise Security
          </span>

          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Fortress-level link protection.
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-lg mx-auto">
            Granular access controls, expiration triggers, and edge routing designed for compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="clean-card p-7 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-900">
              <KeyRound className="w-5 h-5 text-[#635BFF]" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Password Gating</h3>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
              Require visitors to enter a secret password before redirecting to confidential pitch decks or unreleased staging URLs.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="clean-card p-7 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-900">
              <Clock className="w-5 h-5 text-[#635BFF]" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Auto Expiration</h3>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
              Automatically render links inactive after a designated calendar date or after reaching a specific click threshold.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="clean-card p-7 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-900">
              <Zap className="w-5 h-5 text-[#635BFF]" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Edge Redirection</h3>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
              Next.js route handlers execute near your users to resolve target URLs in under 1ms with automatic HTTPS SSL termination.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
