-- ============================================================
-- AI response cache for the generate-cue Edge Function
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Stores one row per muscle+pose pair.
-- Only the Edge Function (service role) reads and writes this table.
CREATE TABLE IF NOT EXISTS ai_response_cache (
  cache_key   TEXT        PRIMARY KEY,  -- "{muscleId}:{poseId}"
  response    TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS enabled with no policies = only service role can access
ALTER TABLE ai_response_cache ENABLE ROW LEVEL SECURITY;
