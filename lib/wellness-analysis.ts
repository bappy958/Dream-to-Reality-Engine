/**
 * Mental Wellness Reflection Assistant
 * 
 * Analyzes monthly dream patterns to provide gentle, supportive insights
 * about emotional trends and mental wellness.
 * 
 * Developed by Bappy Ahmmed (itznobita958@gmail.com)
 */

import { DreamAnalysis } from './dream-analysis'

export interface MonthlyWellnessReport {
  mental_state: 'Calm' | 'Mixed' | 'Healing' | 'Stressed'
  summary: string
  recurring_patterns: string[]
  gentle_recommendation: string
  dominant_themes?: string[]
  theme_explanation?: string
  archetype?: string
  evolution_summary?: string
}

/**
 * Analyze a month's worth of dream analyses to provide wellness insights
 */
export function analyzeMonthlyWellness(
  dreamAnalyses: DreamAnalysis[]
): MonthlyWellnessReport {
  if (!dreamAnalyses || dreamAnalyses.length === 0) {
    return {
      mental_state: 'Mixed',
      summary: 'Your dream journal is just beginning. As you continue to record your dreams, patterns and insights will emerge that can help you understand your inner world better.',
      recurring_patterns: [],
      gentle_recommendation: 'Keep writing your dreams. Over time, you\'ll notice themes and patterns that can offer valuable self-reflection.',
    }
  }

  // Calculate emotional distribution
  const emotionCounts: Record<string, number> = {}
  let totalIntensity = 0
  const allSymbols: string[] = []
  const tones: string[] = []

  dreamAnalyses.forEach(analysis => {
    // Count emotions
    emotionCounts[analysis.primary_emotion] = 
      (emotionCounts[analysis.primary_emotion] || 0) + 1
    
    // Track intensity
    totalIntensity += analysis.emotion_intensity
    
    // Collect symbols
    allSymbols.push(...analysis.symbols)
    
    // Track tones
    tones.push(analysis.overall_tone)
  })

  const dreamCount = dreamAnalyses.length
  const avgIntensity = totalIntensity / dreamCount

  // Find most common emotion
  const dominantEmotion = Object.entries(emotionCounts).reduce((a, b) => 
    a[1] > b[1] ? a : b
  )[0]

  // Calculate emotion diversity
  const uniqueEmotions = Object.keys(emotionCounts).length
  const emotionDiversity = uniqueEmotions / dreamCount

  // Find recurring symbols (appearing in 30%+ of dreams)
  const symbolFrequency: Record<string, number> = {}
  allSymbols.forEach(symbol => {
    symbolFrequency[symbol] = (symbolFrequency[symbol] || 0) + 1
  })

  const recurringSymbols = Object.entries(symbolFrequency)
    .filter(([_, count]) => count >= Math.ceil(dreamCount * 0.3))
    .map(([symbol]) => symbol)
    .slice(0, 5)

  // Analyze tone distribution
  const toneCounts: Record<string, number> = {}
  tones.forEach(tone => {
    toneCounts[tone] = (toneCounts[tone] || 0) + 1
  })

  const positiveToneRatio = (toneCounts['positive'] || 0) / dreamCount
  const transformativeRatio = (toneCounts['transformative'] || 0) / dreamCount
  const negativeToneRatio = (toneCounts['reflective'] || 0) + (toneCounts['contemplative'] || 0) / dreamCount

  // Determine mental state
  let mentalState: 'Calm' | 'Mixed' | 'Healing' | 'Stressed' = 'Mixed'

  if (avgIntensity < 0.3 && dominantEmotion === 'calm' && positiveToneRatio > 0.5) {
    mentalState = 'Calm'
  } else if (avgIntensity > 0.7 && (dominantEmotion === 'anxious' || dominantEmotion === 'dark')) {
    mentalState = 'Stressed'
  } else if (transformativeRatio > 0.4 && positiveToneRatio > negativeToneRatio) {
    mentalState = 'Healing'
  } else {
    mentalState = 'Mixed'
  }

  // Generate empathetic summary
  const summary = generateSummary(
    mentalState,
    dominantEmotion,
    avgIntensity,
    emotionDiversity,
    dreamCount,
    recurringSymbols,
    positiveToneRatio,
    transformativeRatio
  )

  // Identify recurring patterns
  const patterns = identifyPatterns(
    emotionCounts,
    recurringSymbols,
    tones,
    dreamCount
  )

  // Generate gentle recommendation
  const recommendation = generateRecommendation(
    mentalState,
    dominantEmotion,
    avgIntensity,
    recurringSymbols
  )

  return {
    mental_state: mentalState,
    summary,
    recurring_patterns: patterns,
    gentle_recommendation: recommendation,
  }
}

function generateSummary(
  mentalState: string,
  dominantEmotion: string,
  avgIntensity: number,
  emotionDiversity: number,
  dreamCount: number,
  recurringSymbols: string[],
  positiveRatio: number,
  transformativeRatio: number
): string {
  const emotionDescriptions: Record<string, string> = {
    anxious: 'feelings of concern or uncertainty',
    hopeful: 'a sense of possibility and forward movement',
    calm: 'peaceful and centered moments',
    emotional: 'deep feelings and connections',
    intense: 'powerful and vivid experiences',
    dark: 'exploration of shadowy or unknown territories',
  }

  const emotionDesc = emotionDescriptions[dominantEmotion] || 'various emotional experiences'

  let summary = `Over the past month, your dreams have shown ${emotionDesc}. `

  if (mentalState === 'Calm') {
    summary += `There's a sense of balance and tranquility in your inner world. Your dreams reflect a period of stability and peace. `
  } else if (mentalState === 'Healing') {
    summary += `You're experiencing a journey of growth and transformation. Your dreams suggest you're processing change and moving toward new understanding. `
  } else if (mentalState === 'Stressed') {
    summary += `Your dreams indicate you may be navigating some challenges or concerns. This is a natural part of life's journey, and your dreams are helping you process these experiences. `
  } else {
    summary += `Your emotional landscape shows variety and complexity, which is completely normal. Life brings many different experiences, and your dreams reflect this rich inner world. `
  }

  if (recurringSymbols.length > 0) {
    summary += `You've been revisiting themes around ${recurringSymbols.slice(0, 2).join(' and ')} in your dreams, which may hold personal significance for you. `
  }

  if (transformativeRatio > 0.3) {
    summary += `There's a sense of movement and change in your dreams, suggesting you're in a period of growth and discovery. `
  }

  summary += `Remember, dreams are a natural way your mind processes experiences, emotions, and thoughts.`

  return summary
}

function identifyPatterns(
  emotionCounts: Record<string, number>,
  recurringSymbols: string[],
  tones: string[],
  dreamCount: number
): string[] {
  const patterns: string[] = []

  // Emotion patterns
  const emotionEntries = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)

  if (emotionEntries.length > 0) {
    const [emotion, count] = emotionEntries[0]
    const percentage = Math.round((count / dreamCount) * 100)
    if (percentage >= 40) {
      patterns.push(`${emotion.charAt(0).toUpperCase() + emotion.slice(1)} emotions appear in ${percentage}% of your dreams`)
    }
  }

  // Symbol patterns
  if (recurringSymbols.length > 0) {
    patterns.push(`Recurring symbols: ${recurringSymbols.slice(0, 3).join(', ')}`)
  }

  // Tone patterns
  const toneCounts: Record<string, number> = {}
  tones.forEach(tone => {
    toneCounts[tone] = (toneCounts[tone] || 0) + 1
  })

  const mostCommonTone = Object.entries(toneCounts).reduce((a, b) => 
    a[1] > b[1] ? a : b
  )[0]

  if (mostCommonTone && mostCommonTone !== 'neutral') {
    patterns.push(`Overall ${mostCommonTone} tone in your dream experiences`)
  }

  // Emotional diversity
  const uniqueEmotions = Object.keys(emotionCounts).length
  if (uniqueEmotions >= 4) {
    patterns.push('Rich emotional diversity across your dreams')
  }

  return patterns.slice(0, 4) // Limit to 4 patterns
}

function generateRecommendation(
  mentalState: string,
  dominantEmotion: string,
  avgIntensity: number,
  recurringSymbols: string[]
): string {
  const recommendations: Record<string, string[]> = {
    Calm: [
      'Continue to nurture the peace you\'re experiencing. Consider what practices or activities help maintain this sense of balance.',
      'Your inner calm is a valuable resource. Take time to appreciate moments of tranquility in your daily life.',
    ],
    Healing: [
      'You\'re on a meaningful journey of growth. Be gentle with yourself as you navigate changes and new understandings.',
      'Transformation takes time. Trust the process and honor both the challenges and breakthroughs you\'re experiencing.',
    ],
    Stressed: [
      'Your dreams are helping you process concerns. Consider what support systems or self-care practices might help you feel more grounded.',
      'It\'s okay to feel overwhelmed sometimes. What small steps can you take to create more space for rest and reflection?',
    ],
    Mixed: [
      'Your emotional landscape is rich and varied. This complexity is normal and reflects the full range of human experience.',
      'Take time to notice which dreams or themes feel most significant to you. What patterns do you want to explore further?',
    ],
  }

  const stateRecommendations = recommendations[mentalState] || recommendations['Mixed']
  let recommendation = stateRecommendations[0]

  // Add symbol-specific guidance if relevant
  if (recurringSymbols.length > 0) {
    const symbolGuidance: Record<string, string> = {
      water: 'Water in dreams often relates to emotions. Consider how you\'re feeling and what you might need to express.',
      flying: 'Flying dreams can represent freedom or escape. What areas of your life feel liberating or where do you need more freedom?',
      animals: 'Animals in dreams may represent instincts or natural parts of yourself. What qualities do these animals embody that resonate with you?',
      transformation: 'Transformation themes suggest growth. What changes are you experiencing or hoping for?',
    }

    const relevantSymbol = recurringSymbols.find(s => symbolGuidance[s])
    if (relevantSymbol) {
      recommendation += ` ${symbolGuidance[relevantSymbol]}`
    }
  }

  return recommendation
}

