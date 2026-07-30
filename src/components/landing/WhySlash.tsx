'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, BarChart3, Code2 } from 'lucide-react';

const REASONS = [
  {
    icon: Zap,
    title: 'Blazing Fast',
    description: 'Sub-millisecond global redirects with zero latency overhead or artificial delays.',
  },
  {
    icon: Shield,
    title: 'Privacy Focused',
    description: 'Zero invasive third-party ad trackers. Complete ownership of your redirect clickstream.',
  },
  {
    icon: BarChart3,
    title: 'Detailed Analytics',
    description: 'Comprehensive breakdown of click events, device types, geographic locations, and referrers.',
  },
  {
    icon: Code2,
    title: 'Developer Friendly',
    description: 'Built with Next.js 16, TypeScript, Supabase Cloud Postgres, and Command Palette (⌘K) controls.',
  },
];

export default function WhySlash() {
  return (
    <section className="py-24 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold text-[#635BFF] uppercase tracking-wider">
            Why Choose Slash
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Engineered for perfection.
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
            Four reasons why growth teams and developers choose Slash for link infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REASONS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="clean-card p-7 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4"
              >
                <div className="w-11 h-11 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-[#635BFF]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
