/**
 * OpenAI Client Utility
 * 
 * Server-safe OpenAI client for AI dream analysis
 * 
 * Developed by Bappy Ahmmed (itznobita958@gmail.com)
 */

import OpenAI from 'openai'

const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  console.warn('OPENAI_API_KEY not found. AI features will be disabled.')
}

export const openai = apiKey ? new OpenAI({ apiKey }) : null

/**
 * Check if OpenAI is available
 */
export function isOpenAIAvailable(): boolean {
  return openai !== null
}

