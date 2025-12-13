-- Migration: Add video generation fields to dreams table
-- Run this in your Supabase SQL Editor

-- Add video generation columns
ALTER TABLE dreams 
ADD COLUMN IF NOT EXISTS video_id TEXT,
ADD COLUMN IF NOT EXISTS video_job_id TEXT,
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS video_prompt TEXT,
ADD COLUMN IF NOT EXISTS video_status TEXT CHECK (video_status IN ('pending', 'processing', 'completed', 'failed')),
ADD COLUMN IF NOT EXISTS video_error TEXT;

-- Create index on video_status for faster queries
CREATE INDEX IF NOT EXISTS idx_dreams_video_status ON dreams(video_status) WHERE video_status IS NOT NULL;

-- Create index on video_job_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_dreams_video_job_id ON dreams(video_job_id) WHERE video_job_id IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN dreams.video_id IS 'External video provider ID (legacy, use video_job_id)';
COMMENT ON COLUMN dreams.video_job_id IS 'Video generation job ID from provider';
COMMENT ON COLUMN dreams.video_url IS 'URL to generated video';
COMMENT ON COLUMN dreams.video_prompt IS 'Prompt used for video generation';
COMMENT ON COLUMN dreams.video_status IS 'Status: pending, processing, completed, or failed';
COMMENT ON COLUMN dreams.video_error IS 'Error message if video generation failed';

