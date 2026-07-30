'use client';

import React from 'react';
import Link from 'next/link';
import { Slash, Globe, Share2, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-16 text-gray-600 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-gray-100">
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
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
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
              Beautiful link management built for modern creators, developers and teams. Sub-millisecond redirects and real-time clickstream metrics.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {/* GitHub Profile Link */}
              <a
                href="https://github.com/chiragdebugs/urlshortner"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors"
                title="GitHub Repository"
              >
                <Code2 className="w-4 h-4" />
              </a>
              {/* Twitter Profile Link */}
              {/* TODO: Replace with user's Twitter/X profile URL when available */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors"
                title="Twitter"
              >
                <Share2 className="w-4 h-4" />
              </a>
              {/* LinkedIn Profile Link */}
              <a
                href="https://www.linkedin.com/in/chirag-tapre-47a426192/"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors"
                title="LinkedIn Profile"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-gray-900 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-gray-500">
              <li><a href="#features" className="hover:text-gray-900 transition-colors">Features</a></li>
              <li><a href="#security" className="hover:text-gray-900 transition-colors">Security</a></li>
              <li><a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a></li>
              <li><Link href="/dashboard" className="hover:text-gray-900 transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-gray-900 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-gray-500">
              <li><a href="#architecture" className="hover:text-gray-900 transition-colors">Architecture</a></li>
              <li><a href="#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</a></li>
              <li><a href="https://github.com/chiragdebugs/urlshortner" target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors">Source Code</a></li>
              <li><span className="text-emerald-600 font-semibold inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> All Systems Normal</span></li>
            </ul>
          </div>

          {/* Developers & Legal Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-gray-900 uppercase tracking-wider">Developers</h4>
            <ul className="space-y-2 text-gray-500">
              <li><a href="https://nextjs.org" target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors">Next.js 16</a></li>
              <li><a href="https://supabase.com" target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors">Supabase</a></li>
              <li><a href="#privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-gray-900 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 Slash SaaS Inc. Built with modern software craftsmanship.</p>
          <div className="flex items-center gap-1 text-gray-500 font-mono text-[11px]">
            <span>Next.js 16</span>
            <span>•</span>
            <span>Three.js</span>
            <span>•</span>
            <span>Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
