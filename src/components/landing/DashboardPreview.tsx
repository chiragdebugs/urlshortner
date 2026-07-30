'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MousePointerClick, Link2, TrendingUp, Zap, ArrowUpRight } from 'lucide-react';

export default function DashboardPreview() {
  return (
    <section id="demo" className="py-16 bg-gray-50/50 border-y border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Engineered for modern performance
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto">
            Experience the next generation of link intelligence with real-time clickstream logging.
          </p>
        </div>

        {/* Clean Light Floating Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto clean-card bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden"
        >
          {/* Top Browser Bar */}
          <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              <span className="ml-3 text-xs font-mono text-gray-400">slash.app/dashboard</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-gray-500 font-medium">Live Feed</span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-200/80 space-y-1">
                <div className="flex justify-between items-center text-gray-500 text-xs font-medium">
                  <span>Total Redirects</span>
                  <MousePointerClick className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900">14,820</div>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +24.8% this month
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-200/80 space-y-1">
                <div className="flex justify-between items-center text-gray-500 text-xs font-medium">
                  <span>Active Links</span>
                  <Link2 className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900">128</div>
                <p className="text-[11px] text-gray-500">Across 12 custom tags</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-200/80 space-y-1">
                <div className="flex justify-between items-center text-gray-500 text-xs font-medium">
                  <span>Top Referrer</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900">twitter.com</div>
                <p className="text-[11px] text-[#635BFF] font-semibold">42.6% total volume</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-200/80 space-y-1">
                <div className="flex justify-between items-center text-gray-500 text-xs font-medium">
                  <span>Avg Latency</span>
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">0.4 ms</div>
                <p className="text-[11px] text-emerald-600 font-semibold">Edge optimized</p>
              </div>
            </div>

            {/* Chart and Links Mock */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Traffic Chart */}
              <div className="lg:col-span-2 p-5 rounded-xl border border-gray-200 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Traffic Activity</h4>
                  <span className="text-xs text-gray-400 font-mono">1,240 clicks / day avg</span>
                </div>
                <div className="h-36 flex items-end justify-between gap-1.5 pt-4 border-b border-gray-100 pb-1">
                  {[30, 50, 35, 65, 80, 55, 70, 95, 75, 110, 90, 125, 100, 140].map((h, i) => (
                    <div key={i} className="flex-1 bg-[#635BFF]/80 hover:bg-[#635BFF] rounded-t-xs transition-all" style={{ height: `${h}px` }} />
                  ))}
                </div>
              </div>

              {/* Top Links */}
              <div className="p-5 rounded-xl border border-gray-200 space-y-3">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Top Short Links</h4>
                <div className="space-y-2">
                  {[
                    { alias: 'stripe-dev', clicks: '4,820', name: 'Stripe API Guide' },
                    { alias: 'vercel-ship', clicks: '3,150', name: 'Vercel Ship 2026' },
                    { alias: 'linear-plan', clicks: '1,890', name: 'Linear Roadmap' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between">
                      <div className="truncate">
                        <p className="text-xs font-semibold text-gray-900 truncate">{item.name}</p>
                        <p className="text-[11px] text-[#635BFF] font-mono">slash/{item.alias}</p>
                      </div>
                      <span className="text-xs font-bold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200">
                        {item.clicks}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
