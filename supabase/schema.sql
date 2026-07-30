-- Slash SaaS URL Shortener Supabase Postgres Schema

-- 1. Create Links Table
CREATE TABLE IF NOT EXISTS public.links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    original_url TEXT NOT NULL,
    short_code TEXT NOT NULL UNIQUE,
    custom_alias TEXT UNIQUE,
    password_hash TEXT,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    clicks_count INTEGER DEFAULT 0 NOT NULL,
    qr_code_url TEXT,
    tags TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Create Clicks Analytics Table
CREATE TABLE IF NOT EXISTS public.clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id UUID REFERENCES public.links(id) ON DELETE CASCADE NOT NULL,
    short_code TEXT NOT NULL,
    clicked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    referrer TEXT DEFAULT 'direct' NOT NULL,
    browser TEXT DEFAULT 'Chrome' NOT NULL,
    os TEXT DEFAULT 'macOS' NOT NULL,
    device TEXT DEFAULT 'Desktop' NOT NULL,
    country TEXT DEFAULT 'US' NOT NULL,
    city TEXT DEFAULT 'San Francisco',
    user_agent TEXT,
    ip_hash TEXT
);

-- Indexes for blazing fast querying & redirection
CREATE INDEX IF NOT EXISTS idx_links_short_code ON public.links(short_code);
CREATE INDEX IF NOT EXISTS idx_links_custom_alias ON public.links(custom_alias);
CREATE INDEX IF NOT EXISTS idx_clicks_link_id ON public.clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_clicks_clicked_at ON public.clicks(clicked_at);

-- Row Level Security (RLS) Policies
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;

-- Links RLS
CREATE POLICY "Public links read access for active redirection" 
ON public.links FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own links" 
ON public.links FOR ALL 
USING (auth.uid() = user_id);

-- Clicks RLS
CREATE POLICY "Public click logging" 
ON public.clicks FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view click analytics for their links" 
ON public.clicks FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.links 
        WHERE public.links.id = public.clicks.link_id 
        AND (public.links.user_id = auth.uid() OR public.links.user_id IS NULL)
    )
);
