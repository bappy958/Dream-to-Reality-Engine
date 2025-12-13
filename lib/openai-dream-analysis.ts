/**
 * OpenAI Dream Analysis
 * 
 * Uses OpenAI to analyze dreams with empathetic, non-clinical approach
 * 
 * Developed by Bappy Ahmmed (itznobita958@gmail.com)
 */

import { openai, isOpenAIAvailable } from './openai-client'
import { DreamAnalysis } from './dream-analysis'
import { analyzeDream as localAnalyzeDream } from './dream-analysis'

export interface OpenAIDreamAnalysis extends DreamAnalysis {
  primary_emotion: string
  emotion_intensity: number // 0-1
  symbols: string[]
  overall_tone: string
}

const DREAM_ANALYSIS_PROMPT = `You are a dream reflection AI.

Analyze the following dream in a calm, empathetic, non-clinical way.

Goals:
- Identify emotions
- Detect recurring symbols
- Reflect mental tone
- Do NOT diagnose or give medical advice

Return JSON with:
- primary_emotion (one of: anxious, hopeful, calm, emotional, intense, dark)
- emotion_intensity (0-1, where 0 is very low and 1 is very high)
- symbols (array of strings, max 5)
- overall_tone (one of: positive, neutral, negative, reflective, contemplative, transformative)

Dream text:
{dream_text}

Return ONLY valid JSON, no markdown, no code blocks, no explanations.`

/**
 * Analyze dream using OpenAI
 * Falls back to local analysis if OpenAI is unavailable
 */
export async function analyzeDreamWithOpenAI(
  dreamText: string
): Promise<OpenAIDreamAnalysis> {
  // Fallback to local analysis if OpenAI not available
  if (!isOpenAIAvailable() || !openai) {
    console.warn('OpenAI not available, using local analysis')
    return localAnalyzeDream(dreamText) as OpenAIDreamAnalysis
  }

  try {
    const prompt = DREAM_ANALYSIS_PROMPT.replace('{dream_text}', dreamText)

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using cost-effective model
      messages: [
        {
          role: 'system',
          content: 'You are a dream reflection AI. Always return valid JSON only, no markdown formatting.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content

    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Parse JSON response
    const analysis = JSON.parse(content) as OpenAIDreamAnalysis

    // Validate and normalize response
    return {
      primary_emotion: analysis.primary_emotion || 'hopeful',
      emotion_intensity: Math.max(0, Math.min(1, analysis.emotion_intensity || 0.5)),
      symbols: Array.isArray(analysis.symbols) ? analysis.symbols.slice(0, 5) : [],
      overall_tone: analysis.overall_tone || 'neutral',
    }
  } catch (error) {
    console.error('OpenAI analysis error:', error)
    // Fallback to local analysis on error
    return localAnalyzeDream(dreamText) as OpenAIDreamAnalysis
  }
}

