'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Copy, Check, QrCode, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { LinkStore } from '@/lib/store/link-store';
import { LinkItem } from '@/lib/types';
import { useAuth } from '@/lib/auth/auth-context';

interface ShortenerWidgetProps {
  onLinkCreated?: (link: LinkItem) => void;
  compact?: boolean;
}

export default function ShortenerWidget({ onLinkCreated, compact = false }: ShortenerWidgetProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [password, setPassword] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<LinkItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setErrorMsg('Please enter a valid target URL');
      return;
    }

    // Require sign-in to claim and track shortened links
    if (!isAuthenticated) {
      router.push('/signup');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 400));

    try {
      const link = LinkStore.createLink({
        original_url: url,
        custom_alias: customAlias || undefined,
        password: password || undefined,
        expires_at: expiresAt || undefined,
      });

      setCreatedLink(link);
      setLoading(false);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#635BFF', '#4F46E5', '#111827']
      });

      const domain = typeof window !== 'undefined' ? window.location.origin : 'https://slash.dev';
      const shortUrl = `${domain}/${link.custom_alias || link.short_code}`;
      const qrData = await QRCode.toDataURL(shortUrl, {
        width: 300,
        margin: 2,
        color: { dark: '#111827', light: '#ffffff' }
      });
      setQrUrl(qrData);

      if (onLinkCreated) {
        onLinkCreated(link);
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Failed to create short link');
    }
  };

  const handleCopy = () => {
    if (!createdLink) return;
    const domain = typeof window !== 'undefined' ? window.location.origin : 'https://slash.dev';
    const shortUrl = `${domain}/${createdLink.custom_alias || createdLink.short_code}`;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCreatedLink(null);
    setUrl('');
    setCustomAlias('');
    setPassword('');
    setExpiresAt('');
    setShowAdvanced(false);
    setErrorMsg('');
  };

  return (
    <div className={`w-full ${compact ? '' : 'max-w-3xl mx-auto'}`}>
      <div className="clean-card p-6 sm:p-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
        <AnimatePresence mode="wait">
          {!createdLink ? (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full flex-1 flex items-center">
                  <Link2 className="absolute left-4 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    required
                    placeholder="Paste long URL (e.g. https://stripe.com/docs/billing)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-gray-50/70 border border-gray-200 focus:border-[#635BFF] rounded-xl pl-11 pr-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#635BFF] transition-all text-sm sm:text-base font-normal"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto min-w-[130px] px-6 py-3.5 bg-[#635BFF] hover:bg-[#5249e0] text-white font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Shorten</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {errorMsg && (
                <p className="text-red-600 text-xs font-medium">{errorMsg}</p>
              )}

              {/* Advanced Controls Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors cursor-pointer"
                >
                  {showAdvanced ? 'Hide advanced options' : '+ Custom alias, password or expiration'}
                </button>

                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3"
                    >
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Custom Alias</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-2.5 text-xs text-gray-400 font-mono">slash/</span>
                          <input
                            type="text"
                            placeholder="my-link"
                            value={customAlias}
                            onChange={(e) => setCustomAlias(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-12 pr-2.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#635BFF]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Password Protection</label>
                        <input
                          type="password"
                          placeholder="Optional"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#635BFF]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Expiration Date</label>
                        <input
                          type="date"
                          value={expiresAt}
                          onChange={(e) => setExpiresAt(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#635BFF]"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Link Created Successfully</span>
                </span>
                <button
                  onClick={handleReset}
                  className="text-xs text-gray-500 hover:text-gray-900 underline cursor-pointer"
                >
                  Shorten another
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 p-3.5 bg-gray-50 border border-gray-200 rounded-xl">
                <span className="text-gray-900 font-mono text-sm font-bold truncate flex-1">
                  {typeof window !== 'undefined' ? window.location.origin : 'https://slash.dev'}/{createdLink.custom_alias || createdLink.short_code}
                </span>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopy}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-[#635BFF] hover:bg-[#5249e0] text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  {qrUrl && (
                    <button
                      onClick={() => setShowQrModal(true)}
                      className="p-2 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg cursor-pointer"
                      title="View QR Code"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {showQrModal && qrUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-6 rounded-2xl max-w-sm w-full text-center space-y-4 border border-gray-200 shadow-xl"
            >
              <h3 className="text-base font-bold text-gray-900">QR Code</h3>
              <div className="bg-gray-50 p-4 rounded-xl flex justify-center border border-gray-100">
                <img src={qrUrl} alt="QR Code" className="w-48 h-48 rounded" />
              </div>
              <div className="flex gap-2">
                <a
                  href={qrUrl}
                  download={`slash-qr-${createdLink?.short_code}.png`}
                  className="flex-1 py-2 bg-[#635BFF] hover:bg-[#5249e0] text-white font-semibold rounded-lg text-xs"
                >
                  Download PNG
                </a>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg text-xs"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
