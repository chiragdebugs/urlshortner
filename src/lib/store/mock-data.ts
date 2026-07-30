import { LinkItem, ClickLog } from '../types';

export const INITIAL_LINKS: LinkItem[] = [
  {
    id: "link-001",
    title: "Stripe Developer Docs - Billing Integration Guide",
    original_url: "https://stripe.com/docs/billing/subscriptions/overview",
    short_code: "stripe-dev",
    custom_alias: "stripe-dev",
    is_active: true,
    clicks_count: 4820,
    tags: ["Dev", "API", "Stripe"],
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "link-002",
    title: "Vercel Ship 2026 Keynote Presentation & Announcements",
    original_url: "https://vercel.com/blog/ship-2026-keynote",
    short_code: "vercel-ship",
    custom_alias: "vercel-ship",
    is_active: true,
    clicks_count: 3150,
    tags: ["Nextjs", "Vercel", "Launch"],
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "link-003",
    title: "Linear Product Roadmap 2026 - Sprint Planning",
    original_url: "https://linear.app/docs/roadmap-and-projects",
    short_code: "linear-plan",
    custom_alias: "linear-plan",
    password_hash: "slash2026",
    is_active: true,
    clicks_count: 1890,
    tags: ["Product", "Roadmap"],
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "link-004",
    title: "Raycast Store Extension - Slash URL Shortener",
    original_url: "https://raycast.com/store/slash-url-shortener",
    short_code: "ray-slash",
    custom_alias: "ray-slash",
    is_active: true,
    clicks_count: 940,
    tags: ["Extension", "Raycast"],
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "link-005",
    title: "Apple WWDC Keynote Live Stream",
    original_url: "https://developer.apple.com/wwdc/",
    short_code: "wwdc26",
    custom_alias: "wwdc26",
    expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
    is_active: true,
    clicks_count: 620,
    tags: ["Apple", "Event"],
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "link-006",
    title: "GitHub Repository - Slash Open Source Core",
    original_url: "https://github.com/slash/core-engine",
    short_code: "gh-slash",
    custom_alias: "gh-slash",
    is_active: true,
    clicks_count: 2430,
    tags: ["GitHub", "OpenSource"],
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export function generateInitialClicks(links: LinkItem[]): ClickLog[] {
  const clicks: ClickLog[] = [];
  const browsers = ["Chrome", "Safari", "Firefox", "Edge", "Brave"];
  const devices = ["Desktop", "Mobile", "Tablet"];
  const referrers = ["twitter.com", "github.com", "google.com", "news.ycombinator.com", "linkedin.com", "direct"];
  const countries = ["US", "DE", "JP", "GB", "CA", "IN", "FR", "AU"];

  const now = Date.now();

  links.forEach(link => {
    const numClicks = Math.min(link.clicks_count, 120);
    for (let i = 0; i < numClicks; i++) {
      const timeOffset = Math.floor(Math.random() * 30 * 86400000);
      const clickedDate = new Date(now - timeOffset).toISOString();
      
      clicks.push({
        id: `click-${link.id}-${i}`,
        link_id: link.id,
        short_code: link.short_code,
        clicked_at: clickedDate,
        referrer: referrers[Math.floor(Math.random() * referrers.length)],
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        os: devices[Math.floor(Math.random() * devices.length)] === "Mobile" ? "iOS" : "macOS",
        device: devices[Math.floor(Math.random() * devices.length)],
        country: countries[Math.floor(Math.random() * countries.length)],
        city: "San Francisco"
      });
    }
  });

  return clicks;
}
