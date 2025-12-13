import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, getUserFromSession } from '@/lib/supabase-server'
import { analyzeDreamWithOpenAI } from '@/lib/openai-dream-analysis'

/**
 * POST /api/dreams/create
 * Save a new dream with OpenAI AI analysis
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dream_text, emotion, style } = body

    // Validate input
    if (!dream_text || typeof dream_text !== 'string' || dream_text.trim().length === 0) {
      return NextResponse.json(
        { error: 'dream_text is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    // Get authenticated user
    const auth = await getAuthenticatedUser(request) || await getUserFromSession()

    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    const { userId, supabase } = auth

    // Run OpenAI dream analysis
    const analysis = await analyzeDreamWithOpenAI(dream_text.trim())

    // Prepare dream data
    const dreamData = {
      user_id: userId,
      dream_text: dream_text.trim(),
      emotion: emotion || null,
      style: style || null,
      analysis: analysis, // Store full analysis as JSONB
    }

    // Save to database
    const { data, error } = await supabase
      .from('dreams')
      .insert(dreamData)
      .select()
      .single()

    if (error) {
      console.error('Error saving dream:', error)
      return NextResponse.json(
        { error: 'Failed to save dream', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        dream: data,
        analysis: analysis,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

