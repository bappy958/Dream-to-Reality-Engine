import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, getUserFromSession } from '@/lib/supabase-server'
import { analyzeDream } from '@/lib/dream-analysis'

/**
 * POST /api/dreams
 * Save a new dream with AI analysis
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

    // Run AI dream analysis
    const analysis = analyzeDream(dream_text)

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

/**
 * GET /api/dreams
 * Fetch user's dreams (optional: with pagination)
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const auth = await getAuthenticatedUser(request) || await getUserFromSession()

    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { userId, supabase } = auth

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // If ID is provided, fetch single dream
    if (id) {
      const { data, error } = await supabase
        .from('dreams')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching dream:', error)
        return NextResponse.json(
          { error: 'Dream not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        dreams: data ? [data] : [],
        count: data ? 1 : 0,
      })
    }

    // Fetch user's dreams
    const { data, error } = await supabase
      .from('dreams')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching dreams:', error)
      return NextResponse.json(
        { error: 'Failed to fetch dreams' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      dreams: data || [],
      count: data?.length || 0,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

