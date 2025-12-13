/**
 * OpenAI Monthly Wellness Analysis
 * 
 * Analyzes monthly dream patterns using OpenAI with empathetic language
 * 
 * Developed by Bappy Ahmmed (itznobita958@gmail.com)
 */

import { openai, isOpenAIAvailable } from './openai-client'
import { DreamAnalysis } from './dream-analysis'
import { analyzeMonthlyWellness, MonthlyWellnessReport } from './wellness-analysis'

const WELLNESS_ANALYSIS_PROMPT = `You are a mental wellness reflection assistant.

You are given a list of dream analyses from one user over one month.

Your job:
1. Detect emotional trends
2. Identify stress vs healing patterns
3. Summarize mental state gently
4. Use supportive, human language
5. Do NOT diagnose or label illness

Dream analyses (JSON array):
{dream_analyses}

Return JSON with:
- mental_state (one of: Calm, Mixed, Healing, Stressed)
- summary (empathetic paragraph, 2-3 sentences)
- recurring_patterns (array of strings, max 4)
- gentle_recommendation (supportive suggestion, 1-2 sentences)

Return ONLY valid JSON, no markdown, no code blocks, no explanations.`

/**
 * Analyze monthly wellness using OpenAI
 * Falls back to local analysis if OpenAI is unavailable
 */
export async function analyzeMonthlyWellnessWithOpenAI(
  dreamAnalyses: DreamAnalysis[]
): Promise<MonthlyWellnessReport> {
  // Fallback to local analysis if OpenAI not available
  if (!isOpenAIAvailable() || !openai || dreamAnalyses.length === 0) {
    console.warn('OpenAI not available or no dreams, using local analysis')
    return analyzeMonthlyWellness(dreamAnalyses)
  }

  try {
    const analysesJson = JSON.stringify(dreamAnalyses, null, 2)
    const prompt = WELLNESS_ANALYSIS_PROMPT.replace('{dream_analyses}', analysesJson)

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a mental wellness reflection assistant. Always return valid JSON only, no markdown formatting. Use empathetic, supportive language. Never diagnose or provide medical advice.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content

    if (!content) {
      throw new Error('No response from OpenAI')
    }

    const report = JSON.parse(content) as MonthlyWellnessReport

    // Validate response
    const validStates = ['Calm', 'Mixed', 'Healing', 'Stressed']
    return {
      mental_state: validStates.includes(report.mental_state) 
        ? report.mental_state 
        : 'Mixed',
      summary: report.summary || 'Your dream patterns show a rich inner world.',
      recurring_patterns: Array.isArray(report.recurring_patterns) 
        ? report.recurring_patterns.slice(0, 4) 
        : [],
      gentle_recommendation: report.gentle_recommendation || 'Continue reflecting on your dreams and what they mean to you.',
    }
  } catch (error) {
    console.error('OpenAI wellness analysis error:', error)
    // Fallback to local analysis on error
    return analyzeMonthlyWellness(dreamAnalyses)
  }
}

