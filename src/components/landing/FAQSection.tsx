'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'How does Slash achieve sub-millisecond redirection speed?',
    a: 'Slash uses Next.js Route Handlers and Edge Middleware hosted close to end users. Database lookup indices on short_code and custom_alias ensure lightning fast resolution before executing HTTP 307 redirects.',
  },
  {
    q: 'Can I use Slash without connecting a Supabase API key?',
    a: 'Yes! Slash includes a dual storage engine. If Supabase environment variables are missing, it runs seamlessly out-of-the-box with a local state engine pre-seeded with realistic data.',
  },
  {
    q: 'How does password protection work for short links?',
    a: 'When a link is created with a password, visitors navigating to slash/alias are presented with an elegant verification screen. Upon correct password submission, they are securely redirected.',
  },
  {
    q: 'Are there any third-party rate limits or external API key dependencies?',
    a: 'None! Slash is 100% self-contained. We do not rely on third-party URL shortening services, ensuring zero artificial rate limits and full control over your link data.',
  },
  {
    q: 'Can I generate and download QR codes for physical marketing?',
    a: 'Definitely. Every short link created on Slash automatically generates a high-resolution QR code PNG that you can preview and download directly from the dashboard.',
  },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-gray-50/60 border-t border-gray-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-bold text-[#635BFF] uppercase tracking-wider">
            FAQ
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="clean-card rounded-xl bg-white border border-gray-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-sm sm:text-base text-gray-900 hover:text-[#635BFF] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#635BFF]' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
