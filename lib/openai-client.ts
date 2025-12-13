/**
 * OpenAI Client Utility
 * 
 * Server-safe OpenAI client for AI dream analysis
 * 
 * Developed by Bappy Ahmmed (itznobita958@gmail.com)
 */

// Type definition for OpenAI constructor
type OpenAIConstructor = new (config: { apiKey: string }) => {
  // Minimal type definition to avoid requiring the module
  [key: string]: unknown
}

let OpenAIClass: OpenAIConstructor | undefined
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  OpenAIClass = require('openai').default || require('openai')
} catch (error) {
  OpenAIClass = undefined
}

const apiKey = process.env.OPENAI_API_KEY

if (!OpenAIClass || !apiKey) {
  console.warn('OPENAI_API_KEY not found. AI features will be disabled.')
}

export const openai = apiKey && OpenAIClass ? new OpenAIClass({ apiKey }) : null

/**
 * Check if OpenAI is available
 */
export function isOpenAIAvailable(): boolean {
  return openai !== null
}

