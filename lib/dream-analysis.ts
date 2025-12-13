/**
 * Dream Reflection AI
 * 
 * Analyzes dreams in a calm, empathetic, non-clinical way.
 * Identifies emotions, symbols, and mental tone without diagnosis.
 * 
 * Developed by Bappy Ahmmed (itznobita958@gmail.com)
 */

export interface DreamAnalysis {
  primary_emotion: string
  emotion_intensity: number // 0-1
  symbols: string[]
  overall_tone: string
}

// Emotion keywords mapping
const emotionKeywords: Record<string, string[]> = {
  anxious: ['fear', 'worried', 'scared', 'anxious', 'panic', 'nervous', 'threat', 'danger', 'chase', 'hide', 'escape'],
  hopeful: ['hope', 'light', 'bright', 'future', 'success', 'achieve', 'dream', 'goal', 'possibility', 'opportunity', 'growth'],
  calm: ['peace', 'calm', 'serene', 'quiet', 'still', 'tranquil', 'relaxed', 'comfortable', 'safe', 'protected'],
  emotional: ['love', 'loss', 'sad', 'cry', 'tears', 'heart', 'feeling', 'emotion', 'connection', 'relationship', 'missing'],
  intense: ['powerful', 'strong', 'intense', 'overwhelming', 'passionate', 'urgent', 'vivid', 'dramatic', 'transformative'],
  dark: ['dark', 'shadow', 'night', 'black', 'void', 'empty', 'lonely', 'isolated', 'unknown', 'mystery'],
}

// Symbol patterns
const symbolPatterns: Record<string, RegExp[]> = {
  water: [/\b(water|ocean|sea|river|lake|rain|wave|swim|drown|flood)\b/gi],
  flying: [/\b(fly|flying|soar|sky|air|wings|bird|eagle|height|falling)\b/gi],
  animals: [/\b(dog|cat|bird|snake|lion|tiger|bear|wolf|horse|animal|creature)\b/gi],
  vehicles: [/\b(car|bus|train|plane|bike|vehicle|drive|travel|journey|road)\b/gi],
  buildings: [/\b(house|building|room|door|window|stairs|home|school|office)\b/gi],
  people: [/\b(family|friend|parent|child|stranger|person|people|crowd|group)\b/gi],
  nature: [/\b(tree|forest|mountain|hill|garden|flower|grass|earth|ground)\b/gi],
  light: [/\b(light|sun|bright|glow|shine|star|moon|fire|flame|spark)\b/gi],
  darkness: [/\b(dark|shadow|night|black|void|tunnel|cave|underground)\b/gi],
  death: [/\b(death|die|dead|grave|funeral|end|loss|goodbye|farewell)\b/gi],
  transformation: [/\b(change|transform|become|grow|evolve|metamorphosis|shift)\b/gi],
}

// Tone indicators
const toneIndicators = {
  positive: ['happy', 'joy', 'success', 'achievement', 'love', 'peace', 'hope', 'bright', 'beautiful', 'wonderful'],
  neutral: ['normal', 'ordinary', 'regular', 'usual', 'typical', 'standard', 'average'],
  negative: ['sad', 'fear', 'anxiety', 'worry', 'stress', 'pain', 'loss', 'dark', 'scary', 'trouble'],
  transformative: ['change', 'growth', 'transformation', 'journey', 'discovery', 'learning', 'evolution'],
}

export function analyzeDream(dreamText: string): DreamAnalysis {
  if (!dreamText || dreamText.trim().length === 0) {
    return {
      primary_emotion: 'neutral',
      emotion_intensity: 0,
      symbols: [],
      overall_tone: 'neutral',
    }
  }

  const text = dreamText.toLowerCase()
  const words = text.split(/\s+/)
  const wordCount = words.length

  // Analyze emotions
  const emotionScores: Record<string, number> = {}
  
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    let score = 0
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      const matches = text.match(regex)
      if (matches) {
        score += matches.length
      }
    })
    emotionScores[emotion] = score
  })

  // Find primary emotion
  const primaryEmotion = Object.entries(emotionScores).reduce((a, b) => 
    emotionScores[a[0]] > emotionScores[b[0]] ? a : b
  )[0] || 'hopeful'

  // Calculate emotion intensity (0-1)
  const maxScore = Math.max(...Object.values(emotionScores), 1)
  const intensity = Math.min(maxScore / (wordCount * 0.1), 1) // Normalize by text length

  // Detect symbols
  const detectedSymbols: string[] = []
  
  Object.entries(symbolPatterns).forEach(([symbol, patterns]) => {
    patterns.forEach(pattern => {
      if (pattern.test(text)) {
        if (!detectedSymbols.includes(symbol)) {
          detectedSymbols.push(symbol)
        }
      }
    })
  })

  // Determine overall tone
  let positiveCount = 0
  let negativeCount = 0
  let transformativeCount = 0

  toneIndicators.positive.forEach(word => {
    if (text.includes(word)) positiveCount++
  })
  toneIndicators.negative.forEach(word => {
    if (text.includes(word)) negativeCount++
  })
  toneIndicators.transformative.forEach(word => {
    if (text.includes(word)) transformativeCount++
  })

  let overallTone = 'neutral'
  if (transformativeCount > 0 && (positiveCount > negativeCount)) {
    overallTone = 'transformative'
  } else if (positiveCount > negativeCount * 1.5) {
    overallTone = 'positive'
  } else if (negativeCount > positiveCount * 1.5) {
    overallTone = 'reflective'
  } else if (negativeCount > 0) {
    overallTone = 'contemplative'
  }

  return {
    primary_emotion: primaryEmotion,
    emotion_intensity: Math.round(intensity * 100) / 100, // Round to 2 decimals
    symbols: detectedSymbols.slice(0, 5), // Limit to top 5 symbols
    overall_tone: overallTone,
  }
}

/**
 * Get empathetic reflection message based on analysis
 */
export function getDreamReflection(analysis: DreamAnalysis): string {
  const { primary_emotion, overall_tone, symbols } = analysis

  const reflections: Record<string, string> = {
    anxious: 'Your dream reflects feelings of uncertainty or concern. This is a natural response to navigating life\'s challenges. Consider what aspects of your waking life might be contributing to these feelings.',
    hopeful: 'Your dream carries a sense of possibility and forward movement. This suggests you\'re open to growth and new experiences. What opportunities are you most excited about?',
    calm: 'Your dream has a peaceful, centered quality. This may reflect a sense of balance or a need for tranquility in your life. How can you bring more of this calm into your daily routine?',
    emotional: 'Your dream touches on deep feelings and connections. Emotions in dreams often help us process relationships and experiences. What relationships or experiences are most meaningful to you right now?',
    intense: 'Your dream has a powerful, vivid quality. Strong dreams often mark periods of significant change or important realizations. What feels most important or urgent in your life currently?',
    dark: 'Your dream explores shadowy or unknown territories. This can represent parts of yourself or your life that need attention or understanding. What feels hidden or unexplored that you\'d like to bring into the light?',
  }

  const baseReflection = reflections[primary_emotion] || 
    'Your dream offers insights into your inner world. Take time to reflect on what resonates with you.'

  const symbolNote = symbols.length > 0 
    ? ` The presence of ${symbols.slice(0, 2).join(' and ')} in your dream may hold personal significance.`
    : ''

  return baseReflection + symbolNote
}

