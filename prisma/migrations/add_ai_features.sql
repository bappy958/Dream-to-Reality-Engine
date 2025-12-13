-- Migration: Add AI Intelligence Features to monthly_reports
-- Run this in your Supabase SQL Editor

-- Add new columns for AI features
ALTER TABLE monthly_reports 
ADD COLUMN IF NOT EXISTS dominant_themes TEXT, -- JSON array of theme strings
ADD COLUMN IF NOT EXISTS theme_explanation TEXT,
ADD COLUMN IF NOT EXISTS archetype TEXT CHECK (archetype IN ('Dreamer', 'Explorer', 'Seeker', 'Protector', 'Shadow Walker', 'Creator')),
ADD COLUMN IF NOT EXISTS evolution_summary TEXT;

-- Create index on archetype for faster queries
CREATE INDEX IF NOT EXISTS idx_monthly_reports_archetype ON monthly_reports(archetype) WHERE archetype IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN monthly_reports.dominant_themes IS 'JSON array of dominant subconscious themes (e.g. ["Freedom", "Uncertainty", "Exploration"])';
COMMENT ON COLUMN monthly_reports.theme_explanation IS 'Poetic explanation of what the themes represent';
COMMENT ON COLUMN monthly_reports.archetype IS 'Dream archetype: Dreamer, Explorer, Seeker, Protector, Shadow Walker, or Creator';
COMMENT ON COLUMN monthly_reports.evolution_summary IS 'Summary of how dreams have evolved compared to previous months';

