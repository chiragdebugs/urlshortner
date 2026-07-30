'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import OverviewTab from '@/components/dashboard/OverviewTab';
import LinksTab from '@/components/dashboard/LinksTab';
import AnalyticsTab from '@/components/dashboard/AnalyticsTab';
import QRStudioTab from '@/components/dashboard/QRStudioTab';
import SettingsTab from '@/components/dashboard/SettingsTab';
import CreateLinkModal from '@/components/shortener/CreateLinkModal';
import CommandPalette from '@/components/ui/command-palette';
import { useAuth } from '@/lib/auth/auth-context';
import { LinkItem } from '@/lib/types';
import QRCode from 'qrcode';

function DashboardContent() {
  const { isAuthenticated, authLoading, loginAsDemo } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDemoQuery = searchParams.get('demo') === 'true';

  const [activeTab, setActiveTab] = useState('overview');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedQrLink, setSelectedQrLink] = useState<LinkItem | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Wait for Supabase auth initialization to complete
    if (authLoading) return;

    if (isDemoQuery && !isAuthenticated) {
      loginAsDemo();
      setCheckingAuth(false);
      return;
    }

    const stored = typeof window !== 'undefined' ? localStorage.getItem('slash_auth_user_v1') : null;
    if (!isAuthenticated && !stored && !isDemoQuery) {
      router.push('/login');
    } else {
      setCheckingAuth(false);
    }
  }, [isAuthenticated, authLoading, isDemoQuery, loginAsDemo, router]);

  const handleOpenQrModal = async (link: LinkItem) => {
    setSelectedQrLink(link);
    const domain = typeof window !== 'undefined' ? window.location.origin : 'https://slash.dev';
    const shortUrl = `${domain}/${link.custom_alias || link.short_code}`;
    const url = await QRCode.toDataURL(shortUrl, {
      width: 300,
      margin: 2,
      color: { dark: '#111827', light: '#ffffff' }
    });
    setQrUrl(url);
  };

  if (authLoading || checkingAuth) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-[#635BFF] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-500">Preparing workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#635BFF]/15 selection:text-gray-900">
      <CommandPalette />

      <DashboardHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => setIsCreateOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              <OverviewTab
                onSelectTab={setActiveTab}
                onOpenQrModal={handleOpenQrModal}
              />
            </motion.div>
          )}

          {activeTab === 'links' && (
            <motion.div
              key="links"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              <LinksTab
                onOpenCreateModal={() => setIsCreateOpen(true)}
                onOpenQrModal={handleOpenQrModal}
              />
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              <AnalyticsTab />
            </motion.div>
          )}

          {activeTab === 'qr' && (
            <motion.div
              key="qr"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              <QRStudioTab />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              <SettingsTab />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <CreateLinkModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={() => {}}
      />

      <AnimatePresence>
        {selectedQrLink && qrUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-6 rounded-2xl max-w-sm w-full text-center space-y-4 border border-gray-200 shadow-xl"
            >
              <h3 className="text-base font-bold text-gray-900">QR Code Preview</h3>
              <div className="bg-gray-50 p-4 rounded-xl flex justify-center border border-gray-100">
                <img src={qrUrl} alt="QR Code" className="w-48 h-48 rounded" />
              </div>
              <p className="text-xs text-gray-500 font-mono truncate">
                /{selectedQrLink.custom_alias || selectedQrLink.short_code}
              </p>
              <div className="flex gap-2">
                <a
                  href={qrUrl}
                  download={`slash-qr-${selectedQrLink.short_code}.png`}
                  className="flex-1 py-2 bg-[#635BFF] hover:bg-[#5249e0] text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1"
                >
                  Download PNG
                </a>
                <button
                  onClick={() => setSelectedQrLink(null)}
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

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-[#635BFF] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-500">Loading dashboard...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
