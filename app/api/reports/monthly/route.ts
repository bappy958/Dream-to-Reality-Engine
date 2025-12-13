import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, getUserFromSession } from '@/lib/supabase-server'
import { generateMonthlyReport, getCurrentMonthYear } from '@/lib/monthly-aggregation'

/**
 * GET /api/reports/monthly
 * Returns latest monthly mental health report for logged-in user
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

        // Parse patterns and themes if they're strings
        const parsedNewReport = {
          ...newReport,
          patterns: typeof newReport.patterns === 'string'
            ? (() => {
                try {
                  return JSON.parse(newReport.patterns)
                } catch {
                  return newReport.patterns
                }
              })()
            : newReport.patterns,
          dominant_themes: typeof newReport.dominant_themes === 'string'
            ? (() => {
                try {
                  return JSON.parse(newReport.dominant_themes)
                } catch {
                  return []
                }
              })()
            : newReport.dominant_themes,
        }

        return NextResponse.json({
          success: true,
          report: parsedNewReport,
          dreamCount: aggregationResult.dreamCount,
        })
      }

      console.error('Error fetching monthly report:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch report' },
        { status: 500 }
      )
    }

    // Parse patterns and themes if they're strings (with error handling)
    const parsedReport = {
      ...report,
      patterns: typeof report.patterns === 'string'
        ? (() => {
            try {
              return JSON.parse(report.patterns)
            } catch {
              return report.patterns
            }
          })()
        : report.patterns,
      dominant_themes: typeof report.dominant_themes === 'string'
        ? (() => {
            try {
              return JSON.parse(report.dominant_themes)
            } catch {
              return []
            }
          })()
        : report.dominant_themes,
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

