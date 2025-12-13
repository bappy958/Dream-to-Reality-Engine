-- Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Dreams table
CREATE TABLE IF NOT EXISTS dreams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  dream_text TEXT NOT NULL,
  emotion TEXT,
  style TEXT,
  analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_dreams_user_id ON dreams(user_id);

-- Monthly mental health reports
CREATE TABLE IF NOT EXISTS monthly_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  month_year TEXT,
  mental_state TEXT,
  summary TEXT,
  patterns TEXT,
  recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_monthly_reports_user_id ON monthly_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_reports_month_year ON monthly_reports(month_year);

-- Enable Row Level Security (RLS) - users can only see their own data
ALTER TABLE dreams ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for dreams table
CREATE POLICY "Users can view their own dreams"
  ON dreams FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dreams"
  ON dreams FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dreams"
  ON dreams FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dreams"
  ON dreams FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for monthly_reports table
CREATE POLICY "Users can view their own reports"
  ON monthly_reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports"
  ON monthly_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports"
  ON monthly_reports FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reports"
  ON monthly_reports FOR DELETE
  USING (auth.uid() = user_id);

