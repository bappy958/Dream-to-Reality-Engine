/**
 * Dream Evolution Timeline Analysis
 * 
 * Compares current month vs previous months to track emotional and thematic evolution
 * 
 * Developed by Bappy Ahmmed (itznobita958@gmail.com)
 */

import { SupabaseClient } from '@supabase/supabase-js'
import { DreamAnalysis } from './dream-analysis'

export interface EvolutionData {
  current_month: {
    month_year: string
    avg_intensity: number
    dominant_emotion: string
    themes: string[]
  }
  previous_months: Array<{
    month_year: string
    avg_intensity: number
    dominant_emotion: string
    themes: string[]
  }>
  evolution_summary: string
  intensity_trend: 'increasing' | 'decreasing' | 'stable'
  theme_shifts: string[]
}

/**
 * Analyze dream evolution across months
 */
export async function analyzeEvolution(
  supabase: SupabaseClient,
  userId: string,
  currentMonthYear: string
): Promise<EvolutionData | null> {
  try {
    // Fetch current month's dreams
    const [currentYear, currentMonth] = currentMonthYear.split('-').map(Number)
    const currentStart = new Date(currentYear, currentMonth - 1, 1)
    const currentEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59)

    const { data: currentDreams } = await supabase
      .from('dreams')
      .select('analysis, created_at')
      .eq('user_id', userId)
      .gte('created_at', currentStart.toISOString())
      .lte('created_at', currentEnd.toISOString())

    if (!currentDreams || currentDreams.length === 0) {
      return null
    }

    // Analyze current month
    const currentAnalyses = currentDreams
      .map(d => d.analysis)
      .filter((a): a is DreamAnalysis => a !== null && typeof a === 'object' && 'primary_emotion' in a)

    const currentAvgIntensity = currentAnalyses.reduce((sum, a) => sum + a.emotion_intensity, 0) / currentAnalyses.length
    const currentEmotions = currentAnalyses.map(a => a.primary_emotion)
    const currentDominantEmotion = getMostFrequent(currentEmotions)
    const currentThemes = extractThemesFromAnalyses(currentAnalyses)

    // Fetch previous 3 months
    const previousMonths: EvolutionData['previous_months'] = []

    for (let i = 1; i <= 3; i++) {
      const prevDate = new Date(currentYear, currentMonth - 1 - i, 1)
      const prevMonthYear = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`
      const prevStart = new Date(prevDate.getFullYear(), prevDate.getMonth(), 1)
      const prevEnd = new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 0, 23, 59, 59)

      const { data: prevDreams } = await supabase
        .from('dreams')
        .select('analysis')
        .eq('user_id', userId)
        .gte('created_at', prevStart.toISOString())
        .lte('created_at', prevEnd.toISOString())

      if (prevDreams && prevDreams.length > 0) {
        const prevAnalyses = prevDreams
          .map(d => d.analysis)
          .filter((a): a is DreamAnalysis => a !== null && typeof a === 'object' && 'primary_emotion' in a)

        if (prevAnalyses.length > 0) {
          const avgIntensity = prevAnalyses.reduce((sum, a) => sum + a.emotion_intensity, 0) / prevAnalyses.length
          const emotions = prevAnalyses.map(a => a.primary_emotion)
          const dominantEmotion = getMostFrequent(emotions)
          const themes = extractThemesFromAnalyses(prevAnalyses)

          previousMonths.push({
            month_year: prevMonthYear,
            avg_intensity: avgIntensity,
            dominant_emotion: dominantEmotion,
            themes: themes,
          })
        }
      }
    }

    // Calculate trends
    const intensities = [currentAvgIntensity, ...previousMonths.map(m => m.avg_intensity)]
    const intensityTrend = calculateTrend(intensities)

    // Identify theme shifts
    const allThemes = new Set([...currentThemes, ...previousMonths.flatMap(m => m.themes)])
    const themeShifts = identifyThemeShifts(currentThemes, previousMonths.map(m => m.themes))

    // Generate evolution summary
    const evolutionSummary = generateEvolutionSummary(
      currentAvgIntensity,
      previousMonths[0]?.avg_intensity || currentAvgIntensity,
      currentDominantEmotion,
      previousMonths[0]?.dominant_emotion || currentDominantEmotion,
      intensityTrend,
      themeShifts
    )

    return {
      current_month: {
        month_year: currentMonthYear,
        avg_intensity: currentAvgIntensity,
        dominant_emotion: currentDominantEmotion,
        themes: currentThemes,
      },
      previous_months: previousMonths,
      evolution_summary: evolutionSummary,
      intensity_trend: intensityTrend,
      theme_shifts: themeShifts,
    }
  } catch (error) {
    console.error('Error analyzing evolution:', error)
    return null
  }
}

function getMostFrequent(items: string[]): string {
  const counts: Record<string, number> = {}
  items.forEach(item => {
    counts[item] = (counts[item] || 0) + 1
  })
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'hopeful'
}

function extractThemesFromAnalyses(analyses: DreamAnalysis[]): string[] {
  const allSymbols: string[] = []
  analyses.forEach(a => {
    allSymbols.push(...a.symbols)
  })

  const symbolCounts: Record<string, number> = {}
  allSymbols.forEach(symbol => {
    symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1
  })

  const topSymbols = Object.entries(symbolCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([symbol]) => symbol)

  // Map to theme names
  const symbolToTheme: Record<string, string> = {
    water: 'Emotional Flow',
    flying: 'Freedom',
    journey: 'Exploration',
    transformation: 'Growth',
    darkness: 'Uncertainty',
    light: 'Clarity',
  }

  return topSymbols.map(s => symbolToTheme[s] || s.charAt(0).toUpperCase() + s.slice(1))
}

function calculateTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
  if (values.length < 2) return 'stable'

  const recent = values[0]
  const previous = values[1]

  const diff = recent - previous
  const threshold = 0.1

  if (diff > threshold) return 'increasing'
  if (diff < -threshold) return 'decreasing'
  return 'stable'
}

function identifyThemeShifts(current: string[], previous: string[][]): string[] {
  const shifts: string[] = []
  const allPrevious = new Set(previous.flat())

  // New themes
  const newThemes = current.filter(t => !allPrevious.has(t))
  if (newThemes.length > 0) {
    shifts.push(`New themes emerging: ${newThemes.join(', ')}`)
  }

  // Fading themes
  const currentSet = new Set(current)
  const fadingThemes = previous[0]?.filter(t => !currentSet.has(t)) || []
  if (fadingThemes.length > 0) {
    shifts.push(`Themes shifting: ${fadingThemes.join(', ')}`)
  }

  return shifts
}

function generateEvolutionSummary(
  currentIntensity: number,
  previousIntensity: number,
  currentEmotion: string,
  previousEmotion: string,
  trend: 'increasing' | 'decreasing' | 'stable',
  themeShifts: string[]
): string {
  let summary = ''

  // Intensity trend
  if (trend === 'increasing') {
    summary += 'Your dreams are showing deeper emotional intensity, suggesting you\'re exploring more profound inner experiences. '
  } else if (trend === 'decreasing') {
    summary += 'Your dreams are becoming more balanced, reflecting a sense of calm and integration. '
  } else {
    summary += 'Your dream patterns show consistency, indicating a stable inner landscape. '
  }

  // Emotion shift
  if (currentEmotion !== previousEmotion) {
    const emotionNames: Record<string, string> = {
      anxious: 'uncertainty',
      hopeful: 'possibility',
      calm: 'peace',
      emotional: 'depth',
      intense: 'transformation',
      dark: 'exploration',
    }
    summary += `There's a shift from ${emotionNames[previousEmotion] || previousEmotion} toward ${emotionNames[currentEmotion] || currentEmotion} in your dreams. `
  }

  // Theme shifts
  if (themeShifts.length > 0) {
    summary += themeShifts[0] + ' '
  }

  summary += 'This evolution reflects your ongoing journey of self-discovery and inner growth.'

  return summary
}

