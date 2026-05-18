import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    // Verify the caller is authenticated
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return json({ error: 'Unauthorized' }, 401)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return json({ error: 'Unauthorized' }, 401)
    }

    const { muscleId, poseId, systemPrompt, messages } = await req.json()

    // Service role client — used for cache reads/writes only.
    // Users cannot reach this table directly (RLS enabled, no policies).
    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Cache applies only to the first turn (initial cue generation).
    // Follow-up conversation messages are unique per user and not cached.
    const isFirstTurn = messages.length === 1
    const cacheKey = `${muscleId}:${poseId}`

    if (isFirstTurn) {
      const { data: cached } = await admin
        .from('ai_response_cache')
        .select('response')
        .eq('cache_key', cacheKey)
        .single()

      if (cached) {
        // Cache hit — return immediately, no rate limit consumed, no Anthropic call
        return json({ content: [{ text: cached.response }], cached: true })
      }
    }

    // Cache miss — check rate limit before calling Anthropic
    const { data: rateLimit, error: rateLimitError } = await supabase.rpc(
      'check_and_increment_rate_limit',
      { p_user_id: user.id },
    )

    if (rateLimitError) {
      return json({ error: 'Rate limit check failed' }, 500)
    }

    if (!rateLimit.allowed) {
      return json(
        { error: `Rate limit exceeded: ${rateLimit.count}/${rateLimit.limit} requests this hour` },
        429,
      )
    }

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!apiKey) {
      return json({ error: 'ANTHROPIC_API_KEY not configured on server' }, 500)
    }

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages,
      }),
    })

    const data = await upstream.json()

    if (!upstream.ok) {
      return json({ error: data?.error?.message ?? `Anthropic error ${upstream.status}` }, 502)
    }

    // Store first-turn responses in cache for future users
    if (isFirstTurn) {
      const responseText = data.content?.[0]?.text
      if (responseText) {
        await admin.from('ai_response_cache').insert({ cache_key: cacheKey, response: responseText })
      }
    }

    return json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return json({ error: message }, 500)
  }
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}
