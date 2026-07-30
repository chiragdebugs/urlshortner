'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Copy, Check, QrCode, Trash2, Edit3, Lock, Calendar, ExternalLink, Download } from 'lucide-react';
import { LinkStore } from '@/lib/store/link-store';
import { LinkItem } from '@/lib/types';

interface LinksTabProps {
  onOpenCreateModal: () => void;
  onOpenQrModal: (link: LinkItem) => void;
}

export default function LinksTab({ onOpenCreateModal, onOpenQrModal }: LinksTabProps) {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'protected' | 'expired'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'clicks' | 'title'>('newest');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');

  const refreshLinks = () => {
    setLinks(LinkStore.getLinks());
  };

  useEffect(() => {
    refreshLinks();
  }, []);

  const handleCopy = (link: LinkItem) => {
    const domain = typeof window !== 'undefined' ? window.location.origin : 'https://slash.dev';
    const shortUrl = `${domain}/${link.custom_alias || link.short_code}`;
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this short link?')) {
      LinkStore.deleteLink(id);
      refreshLinks();
    }
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;
    LinkStore.updateLink(editingLink.id, {
      title: editTitle,
      original_url: editUrl,
    });
    setEditingLink(null);
    refreshLinks();
  };

  const exportCSV = () => {
    const headers = ["ID", "Title", "Original URL", "Short Code", "Clicks", "Created At"];
    const rows = links.map(l => [
      l.id,
      `"${l.title.replace(/"/g, '""')}"`,
      `"${l.original_url}"`,
      l.custom_alias || l.short_code,
      l.clicks_count,
      l.created_at
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `slash_links_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLinks = links
    .filter(link => {
      const matchSearch =
        link.title.toLowerCase().includes(search.toLowerCase()) ||
        link.short_code.toLowerCase().includes(search.toLowerCase()) ||
        link.original_url.toLowerCase().includes(search.toLowerCase());

      if (!matchSearch) return false;

      if (statusFilter === 'active') return link.is_active;
      if (statusFilter === 'protected') return !!link.password_hash;
      if (statusFilter === 'expired') return !!link.expires_at && new Date(link.expires_at).getTime() < Date.now();

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'clicks') return b.clicks_count - a.clicks_count;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="p-4 rounded-2xl clean-card bg-white border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search links..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#635BFF]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="protected">Protected Links</option>
            <option value="expired">Expired Links</option>
          </select>

          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 focus:outline-none cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="clicks">Most Clicked</option>
            <option value="title">Alphabetical</option>
          </select>

          <button
            onClick={exportCSV}
            className="px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            onClick={onOpenCreateModal}
            className="px-3.5 py-2 bg-[#635BFF] hover:bg-[#5249e0] text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="clean-card rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        {filteredLinks.length === 0 ? (
          <div className="p-10 text-center text-gray-500 text-xs">
            No matching links found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-5">Title & Target</th>
                  <th className="py-3 px-5">Short Link</th>
                  <th className="py-3 px-5">Clicks</th>
                  <th className="py-3 px-5">Security</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredLinks.map((link) => {
                  const isCopied = copiedId === link.id;
                  return (
                    <tr key={link.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-5 max-w-xs">
                        <p className="font-bold text-gray-900 truncate">{link.title}</p>
                        <a
                          href={link.original_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-gray-400 hover:text-gray-700 truncate flex items-center gap-1 mt-0.5"
                        >
                          <span className="truncate">{link.original_url}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </td>

                      <td className="py-3.5 px-5">
                        <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-[#635BFF] font-mono font-bold text-xs border border-indigo-100">
                          /{link.custom_alias || link.short_code}
                        </span>
                      </td>

                      <td className="py-3.5 px-5 font-bold text-gray-900">
                        {link.clicks_count.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-1.5">
                          {link.password_hash && (
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-semibold border border-amber-200">
                              Protected
                            </span>
                          )}
                          {link.expires_at && (
                            <span className="px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 text-[10px] font-semibold border border-cyan-200">
                              Expires
                            </span>
                          )}
                          {!link.password_hash && !link.expires_at && (
                            <span className="text-gray-400 text-[11px]">Standard</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCopy(link)}
                            className="p-1.5 rounded-lg bg-[#635BFF] hover:bg-[#5249e0] text-white transition-colors cursor-pointer"
                            title="Copy Link"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => onOpenQrModal(link)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                            title="View QR Code"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setEditingLink(link);
                              setEditTitle(link.title);
                              setEditUrl(link.original_url);
                            }}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                            title="Edit Link"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(link.id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                            title="Delete Link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingLink && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-6 rounded-2xl max-w-md w-full border border-gray-200 shadow-xl space-y-4"
            >
              <h3 className="text-base font-bold text-gray-900">Edit Link Details</h3>
              <form onSubmit={handleEditSave} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#635BFF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Destination URL</label>
                  <input
                    type="url"
                    required
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#635BFF]"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#635BFF] hover:bg-[#5249e0] text-white font-semibold rounded-lg text-xs"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingLink(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
