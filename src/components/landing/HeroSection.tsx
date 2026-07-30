'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Slash } from 'lucide-react';
import HeroSlashPlanes from '../hero/HeroSlashPlanes';

export default function HeroSection() {
  return (
    <section className="relative pt-28 pb-24 overflow-hidden bg-white min-h-[85vh] flex flex-col justify-center">
      {/* Signature Brand Artwork: 3D Floating Translucent Slash Planes (LOCKED) */}
      <HeroSlashPlanes />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Asymmetric Editorial Content */}
          <div className="lg:col-span-7 space-y-7 text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-lg bg-gray-100 border border-gray-200 text-gray-800 text-xs font-semibold"
            >
              <Slash className="w-3.5 h-3.5 text-[#635BFF] stroke-[2.5]" />
              <span>Built for Developers & Modern Teams</span>
            </motion.div>

            {/* Massive Geist Headline (LOCKED) */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-gray-900 leading-[1.02]"
            >
              Shorten. <br />
              <span className="text-[#635BFF]">Share.</span> Track.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-xl text-lg sm:text-xl text-gray-500 font-normal leading-relaxed"
            >
              Create branded short links with powerful analytics, lightning-fast redirects, and a beautifully designed dashboard built for creators, developers and modern teams.
            </motion.p>

            {/* Primary Action Button (LOCKED) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="pt-2"
            >
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 bg-[#635BFF] hover:bg-[#5249e0] text-white font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2.5 text-base cursor-pointer inline-flex"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Breathing Space for 3D Floating Slash Planes (LOCKED) */}
          <div className="hidden lg:block lg:col-span-5 relative h-96" />
        </div>
      </div>
    </section>
  );
}
