'use client';

import React from 'react';
import Link from 'next/link';
import { Slash, ArrowRight, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 py-3.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo with Slash Geometry */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white shadow-xs group-hover:bg-gray-800 transition-colors">
            <Slash className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-lg tracking-tight text-gray-900">
              Slash
            </span>
            <span className="text-gray-300 font-mono text-sm">/</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
          <a href="#security" className="hover:text-gray-900 transition-colors">Security</a>
          <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={logout}
                className="p-2 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-gray-700 hover:text-gray-900 font-semibold text-xs transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-xl bg-[#635BFF] hover:bg-[#5249e0] text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
