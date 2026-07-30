'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 bg-white border-t border-gray-200 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight">
          Ready to experience modern link management?
        </h2>
        <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
          Every great link starts with a slash. Get started in seconds with zero setup required.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#635BFF] hover:bg-[#5249e0] text-white font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
