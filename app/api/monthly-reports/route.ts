import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, getUserFromSession } from '@/lib/supabase-server'
import { generateMonthlyReport, getCurrentMonthYear, getPreviousMonthYear } from '@/lib/monthly-aggregation'

/**
 * GET /api/monthly-reports
 * Fetch monthly wellness report for the current or specified month
 * Query params: ?month=YYYY-MM (optional, defaults to current month)
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

    // Validate month format (YYYY-MM)
    if (!/^\d{4}-\d{2}$/.test(monthYear)) {
      return NextResponse.json(
        { error: 'Invalid month format. Use YYYY-MM' },
        { status: 400 }
      )
    }

    // Fetch existing report
    const { data: report, error: fetchError } = await supabase
      .from('monthly_reports')
      .select('*')
      .eq('user_id', userId)
      .eq('month_year', monthYear)
      .single()

    if (fetchError) {
      // If no report exists, generate one
      if (fetchError.code === 'PGRST116') {
        const aggregationResult = await generateMonthlyReport(
          supabase,
          userId,
          monthYear
        )

        if (!aggregationResult.success) {
          return NextResponse.json(
            { 
              error: 'Failed to generate report',
              details: aggregationResult.error,
            },
            { status: 500 }
          )
        }

        // Fetch the newly created report
        const { data: newReport, error: newFetchError } = await supabase
          .from('monthly_reports')
          .select('*')
          .eq('user_id', userId)
          .eq('month_year', monthYear)
          .single()

        if (newFetchError) {
          return NextResponse.json(
            { error: 'Failed to fetch generated report' },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          report: {
            ...newReport,
            patterns: typeof newReport.patterns === 'string' 
              ? JSON.parse(newReport.patterns) 
              : newReport.patterns,
          },
          dreamCount: aggregationResult.dreamCount,
        })
      }

      console.error('Error fetching monthly report:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch report' },
        { status: 500 }
      )
    }

    // Parse patterns if it's a string
    const parsedReport = {
      ...report,
      patterns: typeof report.patterns === 'string' 
        ? JSON.parse(report.patterns) 
        : report.patterns,
    }

    return NextResponse.json({
      success: true,
      report: parsedReport,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/monthly-reports/generate
 * Manually trigger monthly report generation
 * Body: { month?: "YYYY-MM" } (optional, defaults to current month)
 */
export async function POST(request: NextRequest) {
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

    // Get month from request body (optional)
    const body = await request.json().catch(() => ({}))
    const monthYear = body.month || getCurrentMonthYear()

    // Validate month format
    if (!/^\d{4}-\d{2}$/.test(monthYear)) {
      return NextResponse.json(
        { error: 'Invalid month format. Use YYYY-MM' },
        { status: 400 }
      )
    }

    // Generate report
    const result = await generateMonthlyReport(supabase, userId, monthYear)

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Failed to generate report',
          details: result.error,
        },
        { status: 500 }
      )
    }

    // Fetch the generated report
    const { data: report, error: fetchError } = await supabase
      .from('monthly_reports')
      .select('*')
      .eq('user_id', userId)
      .eq('month_year', monthYear)
      .single()

    if (fetchError) {
      return NextResponse.json(
        { error: 'Report generated but failed to fetch' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      report: {
        ...report,
        patterns: typeof report.patterns === 'string' 
          ? JSON.parse(report.patterns) 
          : report.patterns,
      },
      dreamCount: result.dreamCount,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

