'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LinkStore } from '@/lib/store/link-store';

interface CreateLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateLinkModal({ isOpen, onClose, onCreated }: CreateLinkModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [password, setPassword] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setErrorMsg('Target URL is required');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    await new Promise(r => setTimeout(r, 400));

    try {
      LinkStore.createLink({
        title: title || undefined,
        original_url: url,
        custom_alias: customAlias || undefined,
        password: password || undefined,
        expires_at: expiresAt || undefined,
      });

      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#635BFF', '#4F46E5', '#111827']
      });

      setLoading(false);
      onCreated();
      onClose();

      setTitle('');
      setUrl('');
      setCustomAlias('');
      setPassword('');
      setExpiresAt('');
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Failed to create link');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white p-6 sm:p-8 rounded-2xl max-w-lg w-full border border-gray-200 shadow-xl space-y-5"
        >
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#635BFF]" />
              <span>Create New Short Link</span>
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Target Destination URL *</label>
              <input
                type="url"
                required
                placeholder="https://example.com/my-long-link"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#635BFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Title / Label (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Stripe Developer Guide"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#635BFF]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Custom Alias</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-xs text-gray-400 font-mono">slash/</span>
                  <input
                    type="text"
                    placeholder="alias"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-2.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#635BFF] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Optional"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#635BFF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Expiration Date</label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#635BFF]"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 bg-[#635BFF] hover:bg-[#5249e0] text-white font-semibold rounded-xl text-xs shadow-xs cursor-pointer"
              >
                {loading ? 'Shortening...' : 'Create Link'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
