'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, BarChart2, ShieldCheck } from 'lucide-react';

const FEATURES = [
  {
    icon: Zap,
    title: 'Lightning-fast Redirects',
    description: 'Instant global redirects optimized for speed, low latency, and sub-millisecond edge resolution.',
  },
  {
    icon: BarChart2,
    title: 'Real-time Analytics',
    description: 'Track clicks, devices, countries, referral channels, and 14-day traffic velocity graphs.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Reliable',
    description: 'Built with modern infrastructure, Row Level Security policies, and Supabase Cloud Postgres.',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-bold text-[#635BFF] uppercase tracking-wider">
            Engineered Excellence
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Built for modern scale.
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
            Everything you need for clean link architecture and real-time clickstream metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="clean-card clean-card-hover p-8 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-[#635BFF]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{feat.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{feat.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
