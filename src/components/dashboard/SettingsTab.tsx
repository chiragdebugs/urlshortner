'use client';

import React, { useState } from 'react';
import { Key, Database, Globe, Copy, Check } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export default function SettingsTab() {
  const [apiKey, setApiKey] = useState('slsh_live_9f823a41e77c8b09d22');
  const [copied, setCopied] = useState(false);
  const [domain, setDomain] = useState('slsh.app');
  const supabaseActive = isSupabaseConfigured();

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    const newKey = `slsh_live_${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(newKey);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* DB Status */}
      <div className="p-6 rounded-2xl clean-card bg-white border border-gray-200 shadow-xs space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-800">
              <Database className="w-4 h-4 text-[#635BFF]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Database Engine</h3>
              <p className="text-xs text-gray-500">Supabase Postgres integration status</p>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${
            supabaseActive
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-indigo-50 text-[#635BFF] border-indigo-100'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#635BFF]" />
            <span>{supabaseActive ? 'Live Supabase DB' : 'Instant Demo Storage'}</span>
          </span>
        </div>
      </div>

      {/* API Key */}
      <div className="p-6 rounded-2xl clean-card bg-white border border-gray-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-gray-600" />
            <span>Developer API Key</span>
          </h3>
          <p className="text-xs text-gray-500">Programmatically create short links with cURL or Node.js</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 p-2 bg-gray-50 rounded-xl border border-gray-200">
          <input
            type="text"
            readOnly
            value={apiKey}
            className="w-full bg-transparent text-xs font-mono text-gray-900 px-3 py-1.5 focus:outline-none"
          />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyKey}
              className="px-3.5 py-1.5 bg-[#635BFF] hover:bg-[#5249e0] text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleRegenerate}
              className="px-3.5 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Roll Key
            </button>
          </div>
        </div>
      </div>

      {/* Domain */}
      <div className="p-6 rounded-2xl clean-card bg-white border border-gray-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-600" />
            <span>Custom Domain Branding</span>
          </h3>
          <p className="text-xs text-gray-500">Point branded short domain CNAME records to Slash Edge</p>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full max-w-sm bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#635BFF]"
          />
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-1">
            <div className="flex justify-between font-mono text-gray-600">
              <span>CNAME Record:</span>
              <span className="text-[#635BFF] font-semibold">cname.slash.app</span>
            </div>
            <div className="flex justify-between font-mono text-gray-600">
              <span>SSL Status:</span>
              <span className="text-emerald-600 font-bold">Active SSL ✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
