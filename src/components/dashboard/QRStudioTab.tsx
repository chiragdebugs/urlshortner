'use client';

import React, { useState, useEffect } from 'react';
import { QrCode, Download } from 'lucide-react';
import QRCode from 'qrcode';
import { LinkStore } from '@/lib/store/link-store';
import { LinkItem } from '@/lib/types';

export default function QRStudioTab() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [selectedLinkId, setSelectedLinkId] = useState<string>('');
  const [darkColor, setDarkColor] = useState('#111827');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [qrData, setQrData] = useState<string | null>(null);

  useEffect(() => {
    const allLinks = LinkStore.getLinks();
    setLinks(allLinks);
    if (allLinks.length > 0) {
      setSelectedLinkId(allLinks[0].id);
    }
  }, []);

  const selectedLink = links.find(l => l.id === selectedLinkId);

  useEffect(() => {
    if (!selectedLink) return;

    const domain = typeof window !== 'undefined' ? window.location.origin : 'https://slash.dev';
    const shortUrl = `${domain}/${selectedLink.custom_alias || selectedLink.short_code}`;

    QRCode.toDataURL(shortUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: darkColor,
        light: lightColor,
      },
    })
      .then(url => setQrData(url))
      .catch(console.error);
  }, [selectedLink, darkColor, lightColor]);

  if (!selectedLink) {
    return (
      <div className="p-10 text-center text-gray-500 text-xs clean-card bg-white rounded-2xl">
        No links available to generate QR code.
      </div>
    );
  }

  const domain = typeof window !== 'undefined' ? window.location.origin : 'https://slash.dev';
  const shortUrl = `${domain}/${selectedLink.custom_alias || selectedLink.short_code}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {/* Controls */}
      <div className="p-6 rounded-2xl clean-card bg-white border border-gray-200 shadow-xs space-y-5">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#635BFF]" />
            <span>High-Res QR Code Studio</span>
          </h3>
          <p className="text-xs text-gray-500">Customize colors and export vector-grade PNG graphics</p>
        </div>

        {/* Link Select */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700">Select Short Link</label>
          <select
            value={selectedLinkId}
            onChange={(e) => setSelectedLinkId(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#635BFF]"
          >
            {links.map((link) => (
              <option key={link.id} value={link.id}>
                {link.title} (/{link.custom_alias || link.short_code})
              </option>
            ))}
          </select>
        </div>

        {/* Color Palette Controls */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700">Foreground</label>
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
              <input
                type="color"
                value={darkColor}
                onChange={(e) => setDarkColor(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
              />
              <span className="text-xs font-mono text-gray-700">{darkColor}</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700">Background</label>
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
              <input
                type="color"
                value={lightColor}
                onChange={(e) => setLightColor(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
              />
              <span className="text-xs font-mono text-gray-700">{lightColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="p-6 rounded-2xl clean-card bg-white border border-gray-200 shadow-xs space-y-4 text-center">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Live Preview</h4>

        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 inline-block">
          {qrData ? (
            <img src={qrData} alt="QR Code Preview" className="w-56 h-56 rounded mx-auto" />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-gray-400 text-xs">Generating...</div>
          )}
        </div>

        <p className="text-xs font-mono text-[#635BFF]">{shortUrl}</p>

        {qrData && (
          <a
            href={qrData}
            download={`slash-qr-${selectedLink.short_code}.png`}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#635BFF] hover:bg-[#5249e0] text-white font-semibold rounded-xl text-xs shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </a>
        )}
      </div>
    </div>
  );
}
