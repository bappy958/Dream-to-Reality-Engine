/**
 * Server-side Supabase utilities
 * For use in API routes and server components
 */

import { createServerClient } from './supabase'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

/**
 * Get authenticated user from request
 * Returns user ID if authenticated, null otherwise
 */
export async function getAuthenticatedUser(request?: NextRequest): Promise<{
  userId: string
  supabase: ReturnType<typeof createServerClient>
} | null> {
  try {
    const supabase = createServerClient()
    
    // Try to get auth token from various sources
    let authToken: string | null = null

    if (request) {
      // From Authorization header
      authToken = request.headers.get('authorization')?.replace('Bearer ', '') || null
    }

    // From cookies (Supabase stores session in cookies)
    if (!authToken) {
      const cookieStore = await cookies()
      // Supabase uses multiple cookie names, try common ones
      authToken = cookieStore.get('sb-access-token')?.value || 
                  cookieStore.get('supabase-auth-token')?.value ||
                  null
    }

    if (!authToken) {
      return null
    }

    // Verify user
    const { data: { user }, error } = await supabase.auth.getUser(authToken)

    if (error || !user) {
      return null
    }

    return {
      userId: user.id,
      supabase,
    }
  } catch (error) {
    console.error('Error getting authenticated user:', error)
    return null
  }
}

/**
 * Alternative: Get user from Supabase session cookie
 * This works if Supabase client is configured to use cookies
 */
export async function getUserFromSession() {
  try {
    const supabase = createServerClient()
    const cookieStore = await cookies()
    
    // Supabase may store session in a cookie
    // This is a fallback method
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session?.user) {
      return null
    }

    return {
      userId: session.user.id,
      supabase,
    }
  } catch (error) {
    console.error('Error getting user from session:', error)
    return null
  }
}

