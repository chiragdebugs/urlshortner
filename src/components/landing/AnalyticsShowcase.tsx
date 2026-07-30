'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { BarChart3 } from 'lucide-react';

const TIMELINE_DATA = [
  { day: 'Mon', clicks: 2400 },
  { day: 'Tue', clicks: 1398 },
  { day: 'Wed', clicks: 9800 },
  { day: 'Thu', clicks: 3908 },
  { day: 'Fri', clicks: 4800 },
  { day: 'Sat', clicks: 3800 },
  { day: 'Sun', clicks: 6300 },
];

export default function AnalyticsShowcase() {
  return (
    <section id="analytics" className="py-20 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <span className="text-xs font-bold text-[#635BFF] uppercase tracking-wider">
              Real-Time Insights
            </span>

            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
              Privacy-first analytics. <br />
              <span className="text-[#635BFF]">Zero third-party trackers.</span>
            </h2>

            <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
              Every single click event is logged directly inside your Supabase Postgres database. Track total clicks, referrer breakdown, device types, and daily click velocity without external dependencies.
            </p>

            <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-gray-700 font-medium">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">✓</span>
                <span>Sub-second event insertion & instant aggregation</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">✓</span>
                <span>GDPR compliant IP hashing & anonymization</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">✓</span>
                <span>Export raw clickstream CSV logs with one click</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column Light Chart Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="clean-card p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4"
          >
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-gray-900">Clickstream Volume</h4>
                <p className="text-xs text-gray-400">Weekly traffic trend across active links</p>
              </div>
              <span className="px-2.5 py-1 bg-indigo-50 text-[#635BFF] text-xs font-bold rounded-md border border-indigo-100">
                +38% growth
              </span>
            </div>

            {/* Area Chart */}
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TIMELINE_DATA}>
                  <defs>
                    <linearGradient id="clickGradLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#635BFF" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#635BFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#9ca3af" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '8px', color: '#111827', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                  />
                  <Area type="monotone" dataKey="clicks" stroke="#635BFF" strokeWidth={2.5} fillOpacity={1} fill="url(#clickGradLight)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
