import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

/**
 * POST /api/auth/verify-otp
 * Verify OTP code and create session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, token } = body

    // Validate input
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Verification code is required' },
        { status: 400 }
      )
    }

    // Use server client for OTP verification
    const supabase = createServerClient()

    // Verify OTP with Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: token.trim(),
      type: 'email',
    })

    if (error) {
      console.error('Error verifying OTP:', error)
      return NextResponse.json(
        { error: error.message || 'Invalid or expired code' },
        { status: 400 }
      )
    }

    if (!data.session) {
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      )
    }

    // Set session cookies manually for server-side auth
    const cookieStore = await cookies()
    cookieStore.set('sb-access-token', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    // Return success with user info (don't expose tokens)
    return NextResponse.json({
      success: true,
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

