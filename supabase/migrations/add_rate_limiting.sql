-- ============================================================
-- Rate limiting for the AI generate-cue Edge Function
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. Table that stores one row per (user, hour) window
CREATE TABLE IF NOT EXISTS ai_rate_limits (
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  window_start  TIMESTAMPTZ NOT NULL,  -- truncated to the hour
  request_count INT         NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, window_start)
);

-- Users can read their own usage (e.g. to show "8/10 requests used")
ALTER TABLE ai_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rate limit"
  ON ai_rate_limits FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================
-- 2. Atomic check-and-increment function
--
-- Uses SECURITY DEFINER so it can write to ai_rate_limits
-- regardless of RLS, and can read the caller's profile role.
--
-- Returns a JSONB object:
--   { "allowed": true/false, "count": 7, "limit": 10 }
-- ============================================================

CREATE OR REPLACE FUNCTION check_and_increment_rate_limit(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_window  TIMESTAMPTZ := date_trunc('hour', NOW());
  v_count   INT;
  v_role    user_role;
  v_limit   INT;
BEGIN
  -- Resolve per-role hourly limit
  SELECT role INTO v_role FROM public.profiles WHERE id = p_user_id;

  v_limit := CASE v_role
    WHEN 'admin'   THEN 2147483647  -- effectively unlimited
    WHEN 'premium' THEN 50
    ELSE 10                         -- free tier
  END;

  -- Atomically insert or increment the counter for this hour's window.
  -- RETURNING gives us the count *after* the increment.
  INSERT INTO ai_rate_limits (user_id, window_start, request_count)
  VALUES (p_user_id, v_window, 1)
  ON CONFLICT (user_id, window_start)
  DO UPDATE SET request_count = ai_rate_limits.request_count + 1
  RETURNING request_count INTO v_count;

  RETURN jsonb_build_object(
    'allowed', v_count <= v_limit,
    'count',   v_count,
    'limit',   v_limit
  );
END;
$$;
