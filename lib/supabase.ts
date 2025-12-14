import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only throw error in development/build time, not at runtime
if (typeof window === 'undefined' && (!supabaseUrl || !supabaseAnonKey)) {
  // In server-side, log warning but don't throw during build
  if (process.env.NODE_ENV === 'production') {
    console.warn('Missing Supabase environment variables. Some features may not work.')
  } else {
    throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required')
  }
}

// Client-side Supabase client (only if env vars are available)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any // Type assertion for build-time safety

// Server-side Supabase client (for API routes)
// Uses service role key for admin operations if needed
export function createServerClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required')
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (serviceRoleKey) {
    return createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }
  
  // Fallback to anon key if service role not available
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Admin client for cron jobs (requires service role key)
export function createAdminClient(): SupabaseClient | null {
  if (!supabaseUrl) {
    console.warn('NEXT_PUBLIC_SUPABASE_URL not found. Admin operations disabled.')
    return null
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!serviceRoleKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not found. Admin operations disabled.')
    return null
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Helper types for database tables
export type Dream = {
  id: string
  user_id: string
  dream_text: string
  emotion: string | null
  style: string | null
  analysis: Record<string, any> | null
  created_at: string
}

export type MonthlyReport = {
  id: string
  user_id: string
  month_year: string
  mental_state: string | null
  summary: string | null
  patterns: string | null
  recommendation: string | null
  created_at: string
}

