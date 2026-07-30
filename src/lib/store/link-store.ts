import { LinkItem, ClickLog, CreateLinkInput, AnalyticsSummary } from '../types';
import { INITIAL_LINKS, generateInitialClicks } from './mock-data';
import { generateShortCode } from '../utils';
import { createClient, isSupabaseConfigured } from '../supabase/client';

const LINKS_STORAGE_KEY = 'slash_links_v1';
const CLICKS_STORAGE_KEY = 'slash_clicks_v1';

export class LinkStore {
  private static links: LinkItem[] = [];
  private static clicks: ClickLog[] = [];
  private static initialized = false;

  private static isDemoUser(): boolean {
    if (typeof window === 'undefined') return false;
    const authUser = localStorage.getItem('slash_auth_user_v1');
    return authUser ? authUser.includes('usr_demo_stripe') : false;
  }

  private static init() {
    if (this.initialized || typeof window === 'undefined') return;

    const isConfigured = isSupabaseConfigured();
    const isDemo = this.isDemoUser();

    // If Supabase is connected AND user is not demo, start with empty array if nothing in DB yet
    if (isConfigured && !isDemo) {
      const storedLinks = localStorage.getItem(LINKS_STORAGE_KEY);
      const storedClicks = localStorage.getItem(CLICKS_STORAGE_KEY);

      if (storedLinks) {
        try {
          this.links = JSON.parse(storedLinks).filter((l: LinkItem) => !l.id.startsWith('mock-'));
        } catch {
          this.links = [];
        }
      } else {
        this.links = [];
      }

      if (storedClicks) {
        try {
          this.clicks = JSON.parse(storedClicks).filter((c: ClickLog) => !c.id.startsWith('mock-'));
        } catch {
          this.clicks = [];
        }
      } else {
        this.clicks = [];
      }
    } else {
      // Demo Mode or Offline Mode: Load rich sample data
      const storedLinks = localStorage.getItem(LINKS_STORAGE_KEY);
      const storedClicks = localStorage.getItem(CLICKS_STORAGE_KEY);

      if (storedLinks) {
        try {
          this.links = JSON.parse(storedLinks);
        } catch {
          this.links = INITIAL_LINKS;
        }
      } else {
        this.links = INITIAL_LINKS;
        localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(this.links));
      }

      if (storedClicks) {
        try {
          this.clicks = JSON.parse(storedClicks);
        } catch {
          this.clicks = generateInitialClicks(this.links);
        }
      } else {
        this.clicks = generateInitialClicks(this.links);
        localStorage.setItem(CLICKS_STORAGE_KEY, JSON.stringify(this.clicks));
      }
    }

    this.initialized = true;

    // Async sync with Supabase if configured
    if (isConfigured && !isDemo) {
      this.syncFromSupabase();
    }
  }

  private static async syncFromSupabase() {
    try {
      const supabase = createClient();
      if (!supabase) return;

      const { data: dbLinks } = await supabase.from('links').select('*');
      if (dbLinks) {
        this.links = dbLinks.map(l => ({
          id: l.id,
          title: l.title,
          original_url: l.original_url,
          short_code: l.short_code,
          custom_alias: l.custom_alias || undefined,
          password_hash: l.password_hash || undefined,
          expires_at: l.expires_at || null,
          is_active: l.is_active,
          clicks_count: l.clicks_count || 0,
          tags: l.tags || ['Custom'],
          created_at: l.created_at,
          updated_at: l.updated_at
        }));
        this.persist();
      }
    } catch (e) {
      console.warn('Supabase sync warning:', e);
    }
  }

  private static persist() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(this.links));
    localStorage.setItem(CLICKS_STORAGE_KEY, JSON.stringify(this.clicks));
  }

  public static getLinks(): LinkItem[] {
    this.init();
    return [...this.links].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public static getLinkByCode(code: string): LinkItem | undefined {
    this.init();
    return this.links.find(
      l => l.short_code.toLowerCase() === code.toLowerCase() || (l.custom_alias && l.custom_alias.toLowerCase() === code.toLowerCase())
    );
  }

  public static createLink(input: CreateLinkInput): LinkItem {
    this.init();

    let rawUrl = input.original_url.trim();
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      rawUrl = 'https://' + rawUrl;
    }

    const shortCode = input.custom_alias ? input.custom_alias.trim() : generateShortCode(6);

    let derivedTitle = input.title?.trim();
    if (!derivedTitle) {
      try {
        const hostname = new URL(rawUrl).hostname.replace('www.', '');
        derivedTitle = `${hostname.charAt(0).toUpperCase() + hostname.slice(1)} Link`;
      } catch {
        derivedTitle = `Link /${shortCode}`;
      }
    }

    const newLink: LinkItem = {
      id: `link-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: derivedTitle,
      original_url: rawUrl,
      short_code: shortCode,
      custom_alias: input.custom_alias ? input.custom_alias.trim() : undefined,
      password_hash: input.password ? input.password.trim() : undefined,
      expires_at: input.expires_at || null,
      is_active: true,
      clicks_count: 0,
      tags: input.tags || ["Custom"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.links.unshift(newLink);
    this.persist();

    // Persist to Supabase if configured and not demo
    if (isSupabaseConfigured() && !this.isDemoUser()) {
      const supabase = createClient();
      if (supabase) {
        supabase.from('links').insert([{
          title: newLink.title,
          original_url: newLink.original_url,
          short_code: newLink.short_code,
          custom_alias: newLink.custom_alias,
          password_hash: newLink.password_hash,
          expires_at: newLink.expires_at,
          is_active: newLink.is_active,
          clicks_count: 0,
          tags: newLink.tags
        }]).then(({ error }) => {
          if (error) console.error('Error inserting link to Supabase:', error);
        });
      }
    }

    return newLink;
  }

  public static recordClick(code: string, referrer: string = 'direct', browser: string = 'Chrome', device: string = 'Desktop', os: string = 'macOS'): void {
    this.init();
    const link = this.getLinkByCode(code);
    if (!link) return;

    link.clicks_count += 1;
    link.updated_at = new Date().toISOString();

    const newClick: ClickLog = {
      id: `click-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      link_id: link.id,
      short_code: link.short_code,
      clicked_at: new Date().toISOString(),
      referrer: referrer || 'direct',
      browser: browser || 'Chrome',
      device: device || 'Desktop',
      os: os || 'macOS',
      country: 'US',
      city: 'San Francisco'
    };

    this.clicks.unshift(newClick);
    this.persist();

    if (isSupabaseConfigured() && !this.isDemoUser()) {
      const supabase = createClient();
      if (supabase) {
        supabase.from('clicks').insert([{
          link_id: link.id.startsWith('link-') ? null : link.id,
          short_code: link.short_code,
          referrer: newClick.referrer,
          browser: newClick.browser,
          device: newClick.device,
          os: newClick.os,
          country: newClick.country,
          city: newClick.city
        }]).then();
      }
    }
  }

  public static deleteLink(id: string): void {
    this.init();
    this.links = this.links.filter(l => l.id !== id);
    this.clicks = this.clicks.filter(c => c.link_id !== id);
    this.persist();

    if (isSupabaseConfigured() && !this.isDemoUser()) {
      const supabase = createClient();
      if (supabase) {
        supabase.from('links').delete().eq('id', id).then();
      }
    }
  }

  public static updateLink(id: string, updates: Partial<LinkItem>): LinkItem | undefined {
    this.init();
    const linkIndex = this.links.findIndex(l => l.id === id);
    if (linkIndex === -1) return undefined;

    this.links[linkIndex] = {
      ...this.links[linkIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.persist();
    return this.links[linkIndex];
  }

  public static getAnalyticsSummary(): AnalyticsSummary {
    this.init();
    const now = Date.now();
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const last7DaysStart = now - 7 * 86400000;
    const last30DaysStart = now - 30 * 86400000;

    const totalClicks = this.links.reduce((acc, l) => acc + l.clicks_count, 0);
    const todayClicks = this.clicks.filter(c => new Date(c.clicked_at).getTime() >= todayStart).length;
    const last7DaysClicks = this.clicks.filter(c => new Date(c.clicked_at).getTime() >= last7DaysStart).length;
    const last30DaysClicks = this.clicks.filter(c => new Date(c.clicked_at).getTime() >= last30DaysStart).length;

    const topLinks = [...this.links]
      .sort((a, b) => b.clicks_count - a.clicks_count)
      .slice(0, 5)
      .map(l => ({
        title: l.title,
        shortCode: l.short_code,
        clicks: l.clicks_count,
        originalUrl: l.original_url
      }));

    const browserCounts: Record<string, number> = {};
    this.clicks.forEach(c => {
      browserCounts[c.browser] = (browserCounts[c.browser] || 0) + 1;
    });

    const browserColors: Record<string, string> = {
      Chrome: '#a855f7',
      Safari: '#3b82f6',
      Firefox: '#f97316',
      Edge: '#06b6d4',
      Brave: '#ef4444'
    };

    const browserDistribution = Object.entries(browserCounts).map(([name, value]) => ({
      name,
      value,
      color: browserColors[name] || '#64748b'
    }));

    const deviceCounts: Record<string, number> = {};
    this.clicks.forEach(c => {
      deviceCounts[c.device] = (deviceCounts[c.device] || 0) + 1;
    });

    const deviceDistribution = Object.entries(deviceCounts).map(([name, value]) => ({
      name,
      value,
      color: name === 'Desktop' ? '#8b5cf6' : name === 'Mobile' ? '#ec4899' : '#10b981'
    }));

    const referrerCounts: Record<string, number> = {};
    this.clicks.forEach(c => {
      referrerCounts[c.referrer] = (referrerCounts[c.referrer] || 0) + 1;
    });

    const referrerDistribution = Object.entries(referrerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value], i) => ({
        name,
        value,
        color: ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981'][i % 5]
      }));

    const timelineMap: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      const dateKey = `${d.getMonth() + 1}/${d.getDate()}`;
      timelineMap[dateKey] = 0;
    }

    this.clicks.forEach(c => {
      const d = new Date(c.clicked_at);
      const dateKey = `${d.getMonth() + 1}/${d.getDate()}`;
      if (timelineMap[dateKey] !== undefined) {
        timelineMap[dateKey] += 1;
      }
    });

    const timeline = Object.entries(timelineMap).map(([date, clicks]) => ({
      date,
      clicks: clicks
    }));

    return {
      totalClicks,
      todayClicks,
      last7DaysClicks,
      last30DaysClicks,
      topLinks,
      browserDistribution,
      deviceDistribution,
      referrerDistribution,
      timeline
    };
  }
}
