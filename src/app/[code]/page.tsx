'use client';

import React, { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, AlertCircle, ArrowRight, Slash } from 'lucide-react';
import { LinkStore } from '@/lib/store/link-store';
import { LinkItem } from '@/lib/types';

export default function RedirectionPage() {
  const params = useParams();
  const code = params?.code as string;

  const [link, setLink] = useState<LinkItem | null | undefined>(undefined);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [expired, setExpired] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!code) return;

    // Ignore static files, google verification, robots, sitemap, etc.
    if (code.includes('.') || code.startsWith('google')) {
      setLink(null);
      return;
    }

    const found = LinkStore.getLinkByCode(code);
    setLink(found || null);

    if (found) {
      // Check expiration
      if (found.expires_at && new Date(found.expires_at).getTime() < Date.now()) {
        setExpired(true);
        return;
      }

      // If no password required, record click and redirect immediately
      if (!found.password_hash) {
        setRedirecting(true);
        LinkStore.recordClick(code);
        window.location.replace(found.original_url);
      }
    }
  }, [code]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!link) return;

    if (passwordInput === link.password_hash) {
      setPasswordError(false);
      setRedirecting(true);
      LinkStore.recordClick(code);
      window.location.replace(link.original_url);
    } else {
      setPasswordError(true);
    }
  };

  // Loading or Active Redirecting State
  if (link === undefined || redirecting) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-gray-900 font-sans">
        <div className="w-9 h-9 border-2 border-[#635BFF] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-gray-600">Redirecting to destination...</p>
        <p className="text-xs font-mono text-gray-400 mt-1">slash.dev/{code}</p>
      </div>
    );
  }

  // Not Found State
  if (link === null) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center font-sans text-gray-900">
        <div className="p-8 rounded-3xl max-w-md w-full border border-gray-200 bg-white shadow-xs space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">Link Not Found</h2>
            <p className="text-sm text-gray-500">
              The short link <code className="text-[#635BFF] font-mono">/{code}</code> does not exist or has been removed.
            </p>
          </div>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#635BFF] hover:bg-[#5249e0] text-white font-semibold rounded-xl text-sm transition-all shadow-xs"
          >
            <span>Back to Slash Home</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  // Expired State
  if (expired) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center font-sans text-gray-900">
        <div className="p-8 rounded-3xl max-w-md w-full border border-gray-200 bg-white shadow-xs space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">Link Expired</h2>
            <p className="text-sm text-gray-500">
              This short link has expired and is no longer accepting redirects.
            </p>
          </div>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl text-sm transition-all"
          >
            <span>Return to Home</span>
          </a>
        </div>
      </div>
    );
  }

  // Password Protected State (ONLY if password_hash is set on the link)
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center font-sans text-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 rounded-3xl max-w-md w-full border border-gray-200 bg-white shadow-xs space-y-6"
      >
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#635BFF] mx-auto">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">Password Protected Link</h2>
          <p className="text-xs text-gray-500">
            Enter the password to access <span className="text-[#635BFF] font-mono font-semibold">/{link.custom_alias || link.short_code}</span>
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              required
              autoFocus
              placeholder="Enter password..."
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-center text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF]"
            />
          </div>

          {passwordError && (
            <p className="text-xs text-red-600 font-semibold">Incorrect password. Please try again.</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#635BFF] hover:bg-[#5249e0] text-white font-semibold rounded-xl text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Unlock Link</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100 text-xs text-gray-400 font-medium flex items-center justify-center gap-1.5">
          <Slash className="w-3.5 h-3.5 text-[#635BFF]" />
          <span>Powered by Slash Infrastructure</span>
        </div>
      </motion.div>
    </div>
  );
}
