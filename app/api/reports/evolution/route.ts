import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, getUserFromSession } from '@/lib/supabase-server'
import { analyzeEvolution } from '@/lib/evolution-analysis'
import { getCurrentMonthYear } from '@/lib/monthly-aggregation'

/**
 * GET /api/reports/evolution
 * Get dream evolution timeline comparing current month vs previous months
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

    // Get month from query params (defaults to current month)
    const { searchParams } = new URL(request.url)
    const monthYear = searchParams.get('month') || getCurrentMonthYear()

    // Validate month format
    if (!/^\d{4}-\d{2}$/.test(monthYear)) {
      return NextResponse.json(
        { error: 'Invalid month format. Use YYYY-MM' },
        { status: 400 }
      )
    }

    // Analyze evolution
    const evolutionData = await analyzeEvolution(supabase, userId, monthYear)

    if (!evolutionData) {
      return NextResponse.json({
        success: true,
        evolution: null,
        message: 'Not enough data for evolution analysis',
      })
    }

    return NextResponse.json({
      success: true,
      evolution: evolutionData,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

