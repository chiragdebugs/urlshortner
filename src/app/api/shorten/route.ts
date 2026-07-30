import { NextResponse } from 'next/server';
import { generateShortCode } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, alias, password, expiresAt } = body;

    if (!url) {
      return NextResponse.json({ error: 'Target URL is required' }, { status: 400 });
    }

    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    const shortCode = alias ? alias.trim() : generateShortCode(6);

    const link = {
      id: `link-api-${Date.now()}`,
      title: targetUrl,
      original_url: targetUrl,
      short_code: shortCode,
      custom_alias: alias || null,
      password_hash: password || null,
      expires_at: expiresAt || null,
      is_active: true,
      clicks_count: 0,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, link }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
