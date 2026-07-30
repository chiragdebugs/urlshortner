'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MousePointerClick, Link2, TrendingUp, Copy, Check, QrCode, Lock, Calendar } from 'lucide-react';
import { LinkStore } from '@/lib/store/link-store';
import { LinkItem, AnalyticsSummary } from '@/lib/types';
import ShortenerWidget from '../shortener/ShortenerWidget';

interface OverviewTabProps {
  onSelectTab: (tab: string) => void;
  onOpenQrModal: (link: LinkItem) => void;
}

export default function OverviewTab({ onSelectTab, onOpenQrModal }: OverviewTabProps) {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const refreshData = () => {
    setLinks(LinkStore.getLinks());
    setAnalytics(LinkStore.getAnalyticsSummary());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleCopy = (link: LinkItem) => {
    const domain = typeof window !== 'undefined' ? window.location.origin : 'https://slash.dev';
    const shortUrl = `${domain}/${link.custom_alias || link.short_code}`;
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Quick Input Bar */}
      <ShortenerWidget compact onLinkCreated={refreshData} />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl clean-card bg-white border border-gray-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Redirects</span>
            <MousePointerClick className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {analytics ? analytics.totalClicks.toLocaleString() : '0'}
          </div>
          <p className="text-xs text-emerald-600 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" /> +18.4% this month
          </p>
        </div>

        <div className="p-5 rounded-2xl clean-card bg-white border border-gray-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <span>Active Links</span>
            <Link2 className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{links.length}</div>
          <p className="text-xs text-gray-500 font-medium">Synced with Supabase</p>
        </div>

        <div className="p-5 rounded-2xl clean-card bg-white border border-gray-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <span>Today's Clicks</span>
            <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {analytics ? analytics.todayClicks.toLocaleString() : '0'}
          </div>
          <p className="text-xs text-[#635BFF] font-semibold">Live logging active</p>
        </div>

        <div className="p-5 rounded-2xl clean-card bg-white border border-gray-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <span>Avg Latency</span>
            <span className="text-emerald-600 font-mono text-xs">⚡ Fast</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">0.4 ms</div>
          <p className="text-xs text-gray-500 font-medium">Edge route optimization</p>
        </div>
      </div>

      {/* Main Grid: Recent Links + Top Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Links */}
        <div className="lg:col-span-2 p-6 rounded-2xl clean-card bg-white border border-gray-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Recent Links</h3>
              <p className="text-xs text-gray-500">Manage and copy your short links</p>
            </div>
            <button
              onClick={() => onSelectTab('links')}
              className="text-xs font-semibold text-[#635BFF] hover:underline cursor-pointer"
            >
              View All ({links.length}) →
            </button>
          </div>

          <div className="space-y-2.5">
            {links.slice(0, 5).map((link) => {
              const isCopied = copiedId === link.id;
              return (
                <div
                  key={link.id}
                  className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-gray-300 transition-all"
                >
                  <div className="truncate space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{link.title}</h4>
                      {link.password_hash && <span title="Password protected"><Lock className="w-3 h-3 text-amber-500" /></span>}
                      {link.expires_at && <span title="Expires"><Calendar className="w-3 h-3 text-cyan-600" /></span>}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-[#635BFF] font-semibold">
                        /{link.custom_alias || link.short_code}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500 truncate max-w-[220px]">{link.original_url}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-gray-200/50 pt-2 sm:pt-0">
                    <span className="text-xs font-bold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200">
                      {link.clicks_count} clicks
                    </span>

                    <button
                      onClick={() => handleCopy(link)}
                      className="p-1.5 rounded-lg bg-[#635BFF] text-white hover:bg-[#5249e0] transition-colors cursor-pointer"
                      title="Copy Link"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => onOpenQrModal(link)}
                      className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                      title="QR Code"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Links */}
        <div className="p-6 rounded-2xl clean-card bg-white border border-gray-200 shadow-xs space-y-4">
          <div className="pb-2 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Top Clicked Links</h3>
            <p className="text-xs text-gray-500">Highest traffic destinations</p>
          </div>

          <div className="space-y-3">
            {analytics?.topLinks.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-200/60 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#635BFF] font-mono">/{item.shortCode}</span>
                  <span className="text-[11px] font-bold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200">
                    {item.clicks} clicks
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-900 truncate">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
