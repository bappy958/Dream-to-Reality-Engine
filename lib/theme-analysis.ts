/**
 * Subconscious Theme Detection
 * 
 * Analyzes dreams for recurring symbolic themes using empathetic AI
 * 
 * Developed by Bappy Ahmmed (itznobita958@gmail.com)
 */

import { DreamAnalysis } from './dream-analysis'
import { openai, isOpenAIAvailable } from './openai-client'

export interface ThemeAnalysis {
  dominant_themes: string[]
  theme_explanation: string
}

const THEME_DETECTION_PROMPT = `You are a dream reflection guide with deep understanding of symbolic language.

Analyze the following dream analyses to identify recurring subconscious themes.
Themes are symbolic patterns that appear across multiple dreams, representing deeper inner narratives.

Dream analyses:
{dream_analyses}

Identify 3-5 dominant themes from these symbolic patterns:
- Look for recurring symbols, emotions, and narrative patterns
- Themes should be poetic and meaningful (e.g., "Freedom", "Uncertainty", "Exploration", "Connection", "Transformation")
- Use empathetic, non-clinical language
- Do NOT diagnose or label

Return JSON with:
- dominant_themes (array of 3-5 theme names as strings)
- theme_explanation (2-3 sentence poetic explanation of what these themes might represent)

Return ONLY valid JSON, no markdown, no code blocks.`

/**
 * Detect subconscious themes from dream analyses
 */
export async function detectThemes(
  dreamAnalyses: DreamAnalysis[]
): Promise<ThemeAnalysis> {
  if (!dreamAnalyses || dreamAnalyses.length === 0) {
    return {
      dominant_themes: [],
      theme_explanation: 'As you continue to record your dreams, themes will begin to emerge that reflect your inner landscape.',
    }
  }

  // Use OpenAI if available, otherwise use local analysis
  if (isOpenAIAvailable() && openai) {
    try {
      const analysesJson = JSON.stringify(dreamAnalyses, null, 2)
      const prompt = THEME_DETECTION_PROMPT.replace('{dream_analyses}', analysesJson)

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a dream reflection guide. Always return valid JSON only. Use poetic, empathetic language. Never diagnose or provide medical advice.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      })

      const content = response.choices[0]?.message?.content
      if (content) {
        const result = JSON.parse(content) as ThemeAnalysis
        return {
          dominant_themes: Array.isArray(result.dominant_themes)
            ? result.dominant_themes.slice(0, 5)
            : [],
          theme_explanation: result.theme_explanation || 'Your dreams reveal rich symbolic patterns.',
        }
      }
    } catch (error) {
      console.error('OpenAI theme detection error:', error)
      // Fall through to local analysis
    }
  }

  // Local theme detection (fallback)
  return detectThemesLocal(dreamAnalyses)
}

/**
 * Local theme detection using pattern analysis
 */
function detectThemesLocal(dreamAnalyses: DreamAnalysis[]): ThemeAnalysis {
  const allSymbols: string[] = []
  const allEmotions: string[] = []
  const allTones: string[] = []

  dreamAnalyses.forEach(analysis => {
    allSymbols.push(...analysis.symbols)
    allEmotions.push(analysis.primary_emotion)
    allTones.push(analysis.overall_tone)
  })

  // Count symbol frequency
  const symbolFrequency: Record<string, number> = {}
  allSymbols.forEach(symbol => {
    symbolFrequency[symbol] = (symbolFrequency[symbol] || 0) + 1
  })

  // Map symbols to themes
  const symbolToTheme: Record<string, string> = {
    water: 'Emotional Flow',
    flying: 'Freedom',
    journey: 'Exploration',
    transformation: 'Growth',
    darkness: 'Uncertainty',
    light: 'Clarity',
    animals: 'Instinct',
    nature: 'Connection',
    people: 'Relationships',
    buildings: 'Stability',
  }

  // Get top symbols
  const topSymbols = Object.entries(symbolFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([symbol]) => symbol)

  // Convert symbols to themes
  const themes = topSymbols
    .map(symbol => symbolToTheme[symbol] || symbol.charAt(0).toUpperCase() + symbol.slice(1))
    .filter((theme, index, self) => self.indexOf(theme) === index) // Remove duplicates
    .slice(0, 5)

  // Add emotion-based themes
  const emotionCounts: Record<string, number> = {}
  allEmotions.forEach(emotion => {
    emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1
  })

  const dominantEmotion = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0]

  if (dominantEmotion) {
    const emotionThemes: Record<string, string> = {
      anxious: 'Uncertainty',
      hopeful: 'Possibility',
      calm: 'Peace',
      emotional: 'Depth',
      intense: 'Transformation',
      dark: 'Exploration',
    }
    const emotionTheme = emotionThemes[dominantEmotion]
    if (emotionTheme && !themes.includes(emotionTheme)) {
      themes.unshift(emotionTheme)
    }
  }

  const explanation = themes.length > 0
    ? `Your dreams weave together themes of ${themes.slice(0, 3).join(', ')}. These patterns reflect the rich inner landscape you're exploring.`
    : 'Your dreams are beginning to reveal their patterns. Keep writing, and themes will emerge.'

  return {
    dominant_themes: themes.slice(0, 5),
    theme_explanation: explanation,
  }
}

