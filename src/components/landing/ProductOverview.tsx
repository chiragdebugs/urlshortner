'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Link, BarChart3, QrCode, ShieldCheck, Zap, Globe } from 'lucide-react';

const PILLARS = [
  {
    icon: Link,
    tag: 'Infrastructure',
    title: 'Intelligent Link Shortening',
    description: 'Transform long, complex URLs into concise, branded short links. Attach custom aliases (slash/launch), password hashes, and automated expiration dates for temporary campaigns.',
    features: ['Branded Custom Aliases', 'Password Lock & Expiration', 'Custom Tags & Categorization'],
  },
  {
    icon: BarChart3,
    tag: 'Analytics Engine',
    title: 'Real-Time Clickstream Metrics',
    description: 'Monitor every redirect event as it happens. View detailed geographic locations, browser usage, device breakdowns, and top-performing referral channels in your interactive dashboard.',
    features: ['Live Referral Channel Tracking', 'Device & Browser Breakdown', '14-Day Traffic Velocity Charts'],
  },
  {
    icon: QrCode,
    tag: 'Distribution',
    title: 'QR Code Studio & Command Palette',
    description: 'Generate high-resolution vector QR codes for physical print, events, and digital media. Control your workspace at lightning speed with built-in Command Palette (⌘K) keyboard shortcuts.',
    features: ['High-Res PNG QR Downloads', 'Command Palette (⌘K) Shortcuts', 'One-Click CSV Data Exports'],
  },
];

export default function ProductOverview() {
  return (
    <section className="py-24 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold text-[#635BFF] uppercase tracking-wider">
            Comprehensive Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Designed for modern link management.
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
            Everything required to brand your links, secure sensitive destinations, and measure traffic velocity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="clean-card p-8 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-[#635BFF]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 border border-gray-200">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900">{pillar.title}</h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{pillar.description}</p>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-2">
                  {pillar.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs font-medium text-gray-700">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
