'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, ShieldCheck, Database, Zap, Sparkles, Layers } from 'lucide-react';

const HIGHLIGHTS = [
  {
    icon: Cpu,
    title: 'React 19 & Next.js 16 App Router',
    description: 'Built on Next.js Turbopack engine with server/client boundaries and route handlers.',
  },
  {
    icon: Sparkles,
    title: 'Three.js 3D WebGL Shader Canvas',
    description: 'GPU-accelerated 60FPS parametric slash planes rendered with custom GLSL shaders.',
  },
  {
    icon: Database,
    title: 'Supabase & Cloud Postgres',
    description: 'Real-time Row Level Security policies, automated auth listener, and database indexing.',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-bold text-[#635BFF] uppercase tracking-wider">
            Software Engineering Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Built with modern technology stack.
          </h2>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            Engineered for performance, security, and real-time link analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HIGHLIGHTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="clean-card p-7 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-[#635BFF]">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
