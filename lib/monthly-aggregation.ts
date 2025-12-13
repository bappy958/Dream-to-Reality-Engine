/**
 * Monthly Aggregation Service
 * 
 * Fetches last month's dreams for a user, runs wellness analysis,
 * and saves to monthly_reports table.
 * 
 * Developed by Bappy Ahmmed (itznobita958@gmail.com)
 */

import { SupabaseClient } from '@supabase/supabase-js'
import { analyzeMonthlyWellness, MonthlyWellnessReport } from './wellness-analysis'
import { analyzeMonthlyWellnessWithOpenAI } from './openai-wellness-analysis'
import { detectThemes } from './theme-analysis'
import { analyzeEvolution } from './evolution-analysis'
import { determineArchetype } from './archetype-analysis'
import { DreamAnalysis } from './dream-analysis'

export interface MonthlyAggregationResult {
  success: boolean
  report?: MonthlyWellnessReport
  dreamCount?: number
  error?: string
}

/**
 * Generate monthly report for a user
 * Fetches last month's dreams, analyzes them, and saves the report
 */
export async function generateMonthlyReport(
  supabase: SupabaseClient,
  userId: string,
  monthYear?: string
): Promise<MonthlyAggregationResult> {
  try {
    // Determine month/year to analyze
    const now = new Date()
    const targetMonth = monthYear || 
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    // Calculate date range for last month
    const [year, month] = targetMonth.split('-').map(Number)
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)

    // Fetch dreams from the specified month
    const { data: dreams, error: fetchError } = await supabase
      .from('dreams')
      .select('analysis')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true })

    if (fetchError) {
      console.error('Error fetching dreams:', fetchError)
      return {
        success: false,
        error: `Failed to fetch dreams: ${fetchError.message}`,
      }
    }

    if (!dreams || dreams.length === 0) {
      return {
        success: false,
        error: 'No dreams found for this month',
        dreamCount: 0,
      }
    }

    // Extract analyses from dreams (they're stored as JSONB)
    const dreamAnalyses: DreamAnalysis[] = dreams
      .map(dream => dream.analysis)
      .filter((analysis): analysis is DreamAnalysis => 
        analysis !== null && 
        typeof analysis === 'object' &&
        'primary_emotion' in analysis
      ) as DreamAnalysis[]

    if (dreamAnalyses.length === 0) {
      return {
        success: false,
        error: 'No valid dream analyses found',
        dreamCount: dreams.length,
      }
    }

    // Run wellness analysis with OpenAI (falls back to local if unavailable)
    const report = await analyzeMonthlyWellnessWithOpenAI(dreamAnalyses)

    // Feature 4: Detect subconscious themes
    const themeAnalysis = await detectThemes(dreamAnalyses)
    report.dominant_themes = themeAnalysis.dominant_themes
    report.theme_explanation = themeAnalysis.theme_explanation

    // Feature 5: Analyze evolution
    const evolutionData = await analyzeEvolution(supabase, userId, targetMonth)
    if (evolutionData) {
      report.evolution_summary = evolutionData.evolution_summary
    }

    // Feature 6: Determine archetype
    const dominantEmotion = dreamAnalyses.reduce((acc, a) => {
      acc[a.primary_emotion] = (acc[a.primary_emotion] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const mostCommonEmotion = Object.entries(dominantEmotion).sort((a, b) => b[1] - a[1])[0]?.[0] || 'hopeful'
    const avgIntensity = dreamAnalyses.reduce((sum, a) => sum + a.emotion_intensity, 0) / dreamAnalyses.length
    const archetypeData = determineArchetype(themeAnalysis.dominant_themes, mostCommonEmotion, avgIntensity)
    report.archetype = archetypeData.archetype

    // Prepare report data for database
    const reportData: any = {
      user_id: userId,
      month_year: targetMonth,
      mental_state: report.mental_state,
      summary: report.summary,
      patterns: JSON.stringify(report.recurring_patterns), // Store as JSON string
      recommendation: report.gentle_recommendation,
      dominant_themes: JSON.stringify(report.dominant_themes || []), // Store themes as JSON
      theme_explanation: report.theme_explanation || null,
      archetype: report.archetype || null,
      evolution_summary: report.evolution_summary || null,
    }

    // Check if report already exists for this month
    const { data: existingReport } = await supabase
      .from('monthly_reports')
      .select('id')
      .eq('user_id', userId)
      .eq('month_year', targetMonth)
      .single()

    let savedReport

    if (existingReport) {
      // Update existing report
      const { data, error: updateError } = await supabase
        .from('monthly_reports')
        .update(reportData)
        .eq('id', existingReport.id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating monthly report:', updateError)
        return {
          success: false,
          error: `Failed to update report: ${updateError.message}`,
        }
      }

      savedReport = data
    } else {
      // Create new report
      const { data, error: insertError } = await supabase
        .from('monthly_reports')
        .insert(reportData)
        .select()
        .single()

      if (insertError) {
        console.error('Error creating monthly report:', insertError)
        return {
          success: false,
          error: `Failed to create report: ${insertError.message}`,
        }
      }

      savedReport = data
    }

    return {
      success: true,
      report: report,
      dreamCount: dreamAnalyses.length,
    }
  } catch (error) {
    console.error('Unexpected error in monthly aggregation:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get the current month-year string (YYYY-MM format)
 */
export function getCurrentMonthYear(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Get the previous month-year string (YYYY-MM format)
 */
export function getPreviousMonthYear(): string {
  const now = new Date()
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  return `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`
}

