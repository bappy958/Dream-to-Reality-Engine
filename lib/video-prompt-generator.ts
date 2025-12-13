/**
 * Video Prompt Generator
 * 
 * Generates cinematic video prompts from dream data
 * 
 * Developed by Bappy Ahmmed (itznobita958@gmail.com)
 */

export interface VideoPromptInput {
  dream_text: string
  emotion: string | null
  style: string | null
  analysis?: {
    primary_emotion?: string
    symbols?: string[]
    overall_tone?: string
  }
}

export interface VideoPromptOutput {
  prompt: string
  style_description: string
  mood: string
}

/**
 * Style-specific prompt templates
 */
const styleTemplates: Record<string, (dream: string, emotion: string, symbols: string[]) => string> = {
  cinematic: (dream, emotion, symbols) => `Cinematic film sequence: ${dream}. 
Style: Hollywood dramatic cinematography, epic wide shots, cinematic color grading, 
${emotion} emotional tone, ${symbols.join(', ')} as visual motifs. 
Camera movements: slow dolly shots, sweeping crane movements, intimate close-ups. 
Lighting: dramatic chiaroscuro, golden hour warmth, moody shadows. 
Visual quality: 4K, film grain, cinematic depth of field.`,

  anime: (dream, emotion, symbols) => `Anime animation style: ${dream}. 
Style: Vibrant Japanese animation, expressive character design, dynamic action sequences, 
${emotion} emotional expression, ${symbols.join(', ')} as key visual elements. 
Art style: cel-shaded, bright saturated colors, detailed backgrounds, 
expressive eyes and emotions. Motion: fluid animation, dynamic camera angles, 
impactful keyframe moments. Visual quality: high-resolution anime aesthetic.`,

  realistic: (dream, emotion, symbols) => `Photorealistic video: ${dream}. 
Style: Documentary-style realism, natural lighting, authentic environments, 
${emotion} emotional atmosphere, ${symbols.join(', ')} as realistic elements. 
Camera: handheld documentary feel, natural color palette, real-world textures. 
Lighting: natural daylight, realistic shadows, environmental lighting. 
Visual quality: 4K photorealistic, cinematic realism, depth of field.`,

  fantasy: (dream, emotion, symbols) => `Fantasy world visualization: ${dream}. 
Style: Magical realism, enchanted landscapes, mystical atmosphere, 
${emotion} emotional journey, ${symbols.join(', ')} as magical elements. 
Visual style: ethereal glow effects, magical particle systems, 
otherworldly color palettes, fantastical architecture. 
Lighting: magical light sources, glowing elements, mystical ambiance. 
Visual quality: high-fantasy aesthetic, dreamlike quality, cinematic magic.`,

  'ai-surreal': (dream, emotion, symbols) => `AI surreal art video: ${dream}. 
Style: Abstract surrealism, dreamlike visuals, AI-generated aesthetics, 
${emotion} emotional abstraction, ${symbols.join(', ')} as surreal elements. 
Art style: fluid morphing forms, impossible geometries, surreal color combinations, 
abstract symbolism. Visual effects: morphing transitions, surreal distortions, 
impossible physics, dream logic. Visual quality: high-resolution surreal art, 
AI-enhanced dreamscape, abstract beauty.`,
}

/**
 * Generate cinematic video prompt from dream data
 */
export function generateVideoPrompt(input: VideoPromptInput): VideoPromptOutput {
  const { dream_text, emotion, style, analysis } = input

  // Extract emotion (prefer analysis, fallback to input)
  const primaryEmotion = analysis?.primary_emotion || emotion || 'hopeful'
  
  // Extract symbols (from analysis or infer from text)
  const symbols = analysis?.symbols || extractSymbolsFromText(dream_text)
  
  // Get style (default to cinematic)
  const videoStyle = style || 'cinematic'
  
  // Get style template
  const template = styleTemplates[videoStyle] || styleTemplates['cinematic']
  
  // Generate prompt
  const prompt = template(
    dream_text.trim(),
    primaryEmotion,
    symbols.slice(0, 5) // Limit to 5 symbols
  )

  // Style description
  const styleDescriptions: Record<string, string> = {
    cinematic: 'Hollywood-style dramatic visuals with epic cinematography',
    anime: 'Vibrant Japanese animation with expressive character design',
    realistic: 'Photorealistic documentary-style with natural lighting',
    fantasy: 'Magical realism with enchanted landscapes and mystical atmosphere',
    'ai-surreal': 'Abstract surrealism with AI-generated dreamlike aesthetics',
  }

  // Mood description
  const moodDescriptions: Record<string, string> = {
    anxious: 'Tense and uncertain atmosphere',
    emotional: 'Deeply moving and heartfelt',
    hopeful: 'Inspiring and uplifting',
    calm: 'Peaceful and serene',
    dark: 'Mysterious and contemplative',
    intense: 'Powerful and transformative',
  }

  return {
    prompt: prompt.trim(),
    style_description: styleDescriptions[videoStyle] || styleDescriptions['cinematic'],
    mood: moodDescriptions[primaryEmotion] || 'Emotionally rich',
  }
}

/**
 * Extract symbols from dream text (simple keyword extraction)
 */
function extractSymbolsFromText(text: string): string[] {
  const symbolKeywords: Record<string, RegExp[]> = {
    water: [/\b(water|ocean|sea|river|lake|rain|wave|swim)\b/gi],
    flying: [/\b(fly|flying|soar|sky|air|wings|bird)\b/gi],
    nature: [/\b(tree|forest|mountain|hill|garden|flower)\b/gi],
    light: [/\b(light|sun|bright|glow|shine|star|moon)\b/gi],
    darkness: [/\b(dark|shadow|night|black|void)\b/gi],
    journey: [/\b(journey|path|road|travel|walk|move)\b/gi],
  }

  const foundSymbols: string[] = []

  for (const [symbol, patterns] of Object.entries(symbolKeywords)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        foundSymbols.push(symbol)
        break
      }
    }
  }

  return foundSymbols.length > 0 ? foundSymbols : ['dream', 'vision', 'journey']
}

