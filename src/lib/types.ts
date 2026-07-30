export interface LinkItem {
  id: string;
  user_id?: string;
  title: string;
  original_url: string;
  short_code: string;
  custom_alias?: string;
  password_hash?: string;
  expires_at?: string | null;
  is_active: boolean;
  clicks_count: number;
  qr_code_url?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface ClickLog {
  id: string;
  link_id: string;
  short_code: string;
  clicked_at: string;
  referrer: string;
  browser: string;
  os: string;
  device: string;
  country: string;
  city?: string;
  user_agent?: string;
}

export interface AnalyticsSummary {
  totalClicks: number;
  todayClicks: number;
  last7DaysClicks: number;
  last30DaysClicks: number;
  topLinks: { title: string; shortCode: string; clicks: number; originalUrl: string }[];
  browserDistribution: { name: string; value: number; color: string }[];
  deviceDistribution: { name: string; value: number; color: string }[];
  referrerDistribution: { name: string; value: number; color: string }[];
  timeline: { date: string; clicks: number }[];
}

export interface CreateLinkInput {
  title?: string;
  original_url: string;
  custom_alias?: string;
  password?: string;
  expires_at?: string;
  tags?: string[];
}
