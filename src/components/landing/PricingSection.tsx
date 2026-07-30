'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

const PLANS = [
  {
    name: 'Starter',
    price: '$0',
    description: 'Perfect for individuals and small side projects.',
    features: [
      'Up to 1,000 links',
      'Custom aliases',
      'Basic click statistics',
      'Standard QR code downloads',
    ],
    cta: 'Get Started Free',
    popular: false,
    href: '/signup',
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For growing teams and creators needing deep intelligence.',
    features: [
      'Unlimited short links',
      'Password protection & expiration',
      'Real-time traffic analytics',
      'High-res vector QR Code Studio',
      'Export raw clickstream CSV',
      'Custom domain support',
    ],
    cta: 'Start Pro Trial',
    popular: true,
    href: '/signup',
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/month',
    description: 'Advanced compliance and dedicated infrastructure.',
    features: [
      'Everything in Pro',
      'High-availability infrastructure on Vercel + Supabase',
      'Dedicated Supabase DB instance',
      'Custom SSO & SAML Auth',
      'Direct email support with fast response times',
    ],
    cta: 'Contact Sales',
    popular: false,
    href: '/signup',
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-gray-50/60 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-bold text-[#635BFF] uppercase tracking-wider">
            Predictable Pricing
          </span>

          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Simple plans for modern teams.
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-lg mx-auto">
            No hidden limits. Start free and scale seamlessly as your click traffic grows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`clean-card p-8 rounded-2xl bg-white border flex flex-col justify-between relative ${
                plan.popular ? 'border-[#635BFF] ring-2 ring-[#635BFF]/20 shadow-md' : 'border-gray-200 shadow-xs'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#635BFF] text-white text-[11px] font-bold uppercase tracking-wider">
                  Most Popular
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-xs text-gray-500">{plan.period}</span>}
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-gray-100 text-xs sm:text-sm text-gray-600">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#635BFF] flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  href={plan.href}
                  className={`w-full py-3 rounded-xl font-semibold text-xs text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    plan.popular
                      ? 'bg-[#635BFF] hover:bg-[#5249e0] text-white shadow-xs'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
