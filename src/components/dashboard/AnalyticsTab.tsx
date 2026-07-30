'use client';

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { LinkStore } from '@/lib/store/link-store';
import { AnalyticsSummary } from '@/lib/types';

export default function AnalyticsTab() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    setAnalytics(LinkStore.getAnalyticsSummary());
  }, []);

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl clean-card bg-white border border-gray-200 shadow-xs space-y-1">
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Lifetime Clicks</span>
          <div className="text-2xl font-bold text-gray-900">{analytics.totalClicks.toLocaleString()}</div>
          <p className="text-xs text-[#635BFF] font-semibold">All-time redirect volume</p>
        </div>

        <div className="p-5 rounded-2xl clean-card bg-white border border-gray-200 shadow-xs space-y-1">
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Today's Clicks</span>
          <div className="text-2xl font-bold text-gray-900">{analytics.todayClicks.toLocaleString()}</div>
          <p className="text-xs text-emerald-600 font-semibold">+14% vs yesterday</p>
        </div>

        <div className="p-5 rounded-2xl clean-card bg-white border border-gray-200 shadow-xs space-y-1">
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Last 7 Days</span>
          <div className="text-2xl font-bold text-gray-900">{analytics.last7DaysClicks.toLocaleString()}</div>
          <p className="text-xs text-gray-500 font-medium">Rolling 7-day total</p>
        </div>

        <div className="p-5 rounded-2xl clean-card bg-white border border-gray-200 shadow-xs space-y-1">
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Last 30 Days</span>
          <div className="text-2xl font-bold text-gray-900">{analytics.last30DaysClicks.toLocaleString()}</div>
          <p className="text-xs text-gray-500 font-medium">Monthly active volume</p>
        </div>
      </div>

      {/* Main Area Chart */}
      <div className="p-6 rounded-2xl clean-card bg-white border border-gray-200 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Traffic Velocity Timeline</h3>
            <p className="text-xs text-gray-500">Daily click aggregation over past 14 days</p>
          </div>
          <span className="px-2.5 py-1 bg-indigo-50 text-[#635BFF] text-xs font-bold rounded-md border border-indigo-100">
            Live Feed
          </span>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.timeline}>
              <defs>
                <linearGradient id="analyticsGradLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#635BFF" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#635BFF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} tickLine={false} />
              <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '8px', color: '#111827', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
              />
              <Area type="monotone" dataKey="clicks" stroke="#635BFF" strokeWidth={2.5} fillOpacity={1} fill="url(#analyticsGradLight)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid for Referrers, Browsers, Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Referrers */}
        <div className="p-6 rounded-2xl clean-card bg-white border border-gray-200 shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Top Referrers</h4>
          <div className="space-y-2.5">
            {analytics.referrerDistribution.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="text-[#635BFF] font-bold">{item.value} clicks</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, (item.value / analytics.totalClicks) * 100 * 2)}%` }}
                    className="h-full bg-[#635BFF] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Browsers */}
        <div className="p-6 rounded-2xl clean-card bg-white border border-gray-200 shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Browser Breakdown</h4>
          <div className="h-40 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={analytics.browserDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={4}>
                  {analytics.browserDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#635BFF', '#3b82f6', '#f97316', '#06b6d4', '#ef4444'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Devices */}
        <div className="p-6 rounded-2xl clean-card bg-white border border-gray-200 shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Device Breakdown</h4>
          <div className="h-40 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={analytics.deviceDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={4}>
                  {analytics.deviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#111827', '#635BFF', '#10b981'][index % 3]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
