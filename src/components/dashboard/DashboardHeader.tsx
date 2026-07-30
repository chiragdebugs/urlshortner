'use client';

import React from 'react';
import Link from 'next/link';
import { Slash, Plus, LayoutDashboard, Link2, BarChart3, QrCode, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

interface DashboardHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCreateModal: () => void;
}

export default function DashboardHeader({ activeTab, setActiveTab, onOpenCreateModal }: DashboardHeaderProps) {
  const { user, logout } = useAuth();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'links', label: 'Links', icon: Link2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'qr', label: 'QR Studio', icon: QrCode },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Back to Home */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center text-white">
                <Slash className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="font-bold text-base text-gray-900">Slash</span>
            </Link>

            <span className="text-gray-300">/</span>

            <span className="text-xs font-semibold text-gray-600">
              {user?.name || 'Dashboard'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCreateModal}
              className="px-3.5 py-2 bg-[#635BFF] hover:bg-[#5249e0] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Link</span>
            </button>

            <button
              onClick={logout}
              className="p-2 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Row */}
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-2 border-t border-gray-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 border border-gray-200'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#635BFF]' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
