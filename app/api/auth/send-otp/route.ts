import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * POST /api/auth/send-otp
 * Send OTP (magic link/code) to user's email using Supabase Auth
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Use server client for OTP sending
    const supabase = createServerClient()

    // Use Supabase Auth to send OTP
    // This sends a magic link/code to the email
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        // Optional: customize email template
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    })

    if (error) {
      console.error('Error sending OTP:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to send login code' },
        { status: 400 }
      )
    }

    // Supabase will send the OTP email automatically
    // We don't expose the OTP code for security
    return NextResponse.json({
      success: true,
      message: 'Login code sent to your email',
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

