'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Link as LinkIcon, Plus, LayoutDashboard, BarChart3, QrCode, Settings, ArrowRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LinkStore } from '@/lib/store/link-store';
import { LinkItem } from '@/lib/types';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [links, setLinks] = useState<LinkItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setLinks(LinkStore.getLinks());
    }
  }, [isOpen]);

  const filteredLinks = links.filter(l =>
    l.title.toLowerCase().includes(query.toLowerCase()) ||
    l.short_code.toLowerCase().includes(query.toLowerCase()) ||
    l.original_url.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="glass-panel w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden bg-slate-900/90"
        >
          {/* Input Header */}
          <div className="flex items-center px-4 border-b border-white/10">
            <Search className="w-5 h-5 text-purple-400 mr-3" />
            <input
              type="text"
              autoFocus
              placeholder="Type a command or search links... (Esc to close)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent py-4 text-white placeholder-slate-400 focus:outline-none text-base"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body List */}
          <div className="max-h-96 overflow-y-auto p-2 space-y-4">
            {/* Quick Actions */}
            <div>
              <p className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-1">
                Navigation & Actions
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => { router.push('/dashboard'); setIsOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-purple-600/20 hover:text-purple-200 text-slate-300 text-sm transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4 text-purple-400" />
                    <span>Go to Dashboard</span>
                  </div>
                  <span className="text-xs text-slate-500 group-hover:text-purple-300">↵ Jump</span>
                </button>

                <button
                  onClick={() => { router.push('/dashboard?tab=analytics'); setIsOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-purple-600/20 hover:text-purple-200 text-slate-300 text-sm transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-4 h-4 text-cyan-400" />
                    <span>View Real-Time Analytics</span>
                  </div>
                  <span className="text-xs text-slate-500 group-hover:text-purple-300">↵ Jump</span>
                </button>
              </div>
            </div>

            {/* Links Results */}
            <div>
              <p className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-1">
                Your Links ({filteredLinks.length})
              </p>
              {filteredLinks.length === 0 ? (
                <p className="px-3 py-4 text-xs text-slate-500 text-center">No matching links found</p>
              ) : (
                <div className="space-y-1">
                  {filteredLinks.slice(0, 6).map((link) => (
                    <button
                      key={link.id}
                      onClick={() => {
                        const domain = typeof window !== 'undefined' ? window.location.origin : 'https://slash.dev';
                        navigator.clipboard.writeText(`${domain}/${link.custom_alias || link.short_code}`);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 text-sm transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3 truncate pr-4">
                        <LinkIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <div className="truncate">
                          <p className="text-white text-xs sm:text-sm font-medium truncate">{link.title}</p>
                          <p className="text-[11px] text-purple-400 font-mono truncate">/{link.custom_alias || link.short_code}</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-500 group-hover:text-white flex-shrink-0">Copy Short URL</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer status */}
          <div className="px-4 py-2 border-t border-white/10 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Use <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-white/10 text-slate-300">↑</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-white/10 text-slate-300">↓</kbd> to navigate</span>
            <span>Slash SaaS Engine</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
