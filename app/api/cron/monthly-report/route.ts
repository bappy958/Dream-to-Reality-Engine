import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { generateMonthlyReport, getPreviousMonthYear } from '@/lib/monthly-aggregation'

/**
 * POST /api/cron/monthly-report
 * 
 * Vercel Cron endpoint that runs monthly
 * For each user:
 * - Generate monthly report for previous month
 * - Save to DB
 * 
 * Protected by Vercel Cron secret (optional but recommended)
 */
export async function POST(request: NextRequest) {
  try {
    // Optional: Verify cron secret for security
    const cronSecret = request.headers.get('authorization')
    const expectedSecret = process.env.CRON_SECRET

    if (expectedSecret && cronSecret !== `Bearer ${expectedSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Use server client for cron operations
    const supabase = createServerClient()
    const previousMonth = getPreviousMonthYear()

    // Get all users who have dreams in the previous month
    // This is more efficient than fetching all users
    const { data: dreams, error: dreamsError } = await supabase
      .from('dreams')
      .select('user_id')
      .gte('created_at', new Date(
        parseInt(previousMonth.split('-')[0]),
        parseInt(previousMonth.split('-')[1]) - 1,
        1
      ).toISOString())
      .lte('created_at', new Date(
        parseInt(previousMonth.split('-')[0]),
        parseInt(previousMonth.split('-')[1]),
        0,
        23,
        59,
        59
      ).toISOString())

    if (dreamsError) {
      console.error('Error fetching dreams:', dreamsError)
      return NextResponse.json(
        { error: 'Failed to fetch dreams', details: dreamsError.message },
        { status: 500 }
      )
    }

    if (!dreams || dreams.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No dreams found for previous month',
        processed: 0,
      })
    }

    // Get unique user IDs
    const uniqueUserIds = [...new Set(dreams.map(d => d.user_id))]

    const results = {
      processed: 0,
      succeeded: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Process each user
    for (const userId of uniqueUserIds) {
      try {
        // Generate monthly report
        const reportResult = await generateMonthlyReport(
          supabase,
          userId,
          previousMonth
        )

        if (!reportResult.success || !reportResult.report) {
          results.failed++
          results.errors.push(`User ${userId}: ${reportResult.error || 'Failed to generate report'}`)
          continue
        }

        // Report generated and saved successfully
        results.succeeded++
        results.processed++
      } catch (error) {
        results.failed++
        results.processed++
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        results.errors.push(`User ${userId}: ${errorMessage}`)
        console.error(`Error processing user ${userId}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${results.processed} users for ${previousMonth}`,
      results: {
        processed: results.processed,
        succeeded: results.succeeded,
        failed: results.failed,
        errors: results.errors.slice(0, 10), // Limit error details
      },
    })
  } catch (error) {
    console.error('Unexpected error in cron job:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/cron/monthly-report
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Monthly report cron endpoint is active',
    timestamp: new Date().toISOString(),
  })
}

