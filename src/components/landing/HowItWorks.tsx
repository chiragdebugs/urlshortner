'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Link2, Sliders, BarChart3, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: Link2,
    title: 'Paste Destination URL',
    description: 'Paste any long target link. Slash instantly formats and checks destination availability.',
  },
  {
    step: '02',
    icon: Sliders,
    title: 'Customize Controls',
    description: 'Claim branded custom aliases (slash/launch), set secret passwords, or attach expiration rules.',
  },
  {
    step: '03',
    icon: BarChart3,
    title: 'Track Traffic Velocity',
    description: 'Monitor real-time clickstream events, browser usage, and referral performance in your dashboard.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50/50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-bold text-[#635BFF] uppercase tracking-wider">
            Simple Workflow
          </span>

          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            How Slash works in seconds.
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-md mx-auto">
            Three simple steps to transform long URLs into intelligent marketing assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="clean-card p-8 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-900">
                    <Icon className="w-5 h-5 text-[#635BFF]" />
                  </div>
                  <span className="text-2xl font-extrabold text-gray-200 font-mono">{item.step}</span>
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
