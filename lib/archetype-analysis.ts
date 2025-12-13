/**
 * Dream Archetype System
 * 
 * Assigns archetypes based on dominant themes and emotions
 * 
 * Developed by Bappy Ahmmed (itznobita958@gmail.com)
 */

export type DreamArchetype =
  | 'Dreamer'
  | 'Explorer'
  | 'Seeker'
  | 'Protector'
  | 'Shadow Walker'
  | 'Creator'

export interface ArchetypeData {
  archetype: DreamArchetype
  description: string
  characteristics: string[]
}

const ARCHETYPE_DEFINITIONS: Record<DreamArchetype, ArchetypeData> = {
  Dreamer: {
    archetype: 'Dreamer',
    description: 'You navigate worlds of possibility, where imagination and reality blend into beautiful visions. Your dreams are gateways to what could be.',
    characteristics: ['Imaginative', 'Visionary', 'Hopeful', 'Intuitive'],
  },
  Explorer: {
    archetype: 'Explorer',
    description: 'Your dreams are journeys into unknown territories. You seek new experiences, understanding, and perspectives in your inner landscape.',
    characteristics: ['Curious', 'Adventurous', 'Open-minded', 'Courageous'],
  },
  Seeker: {
    archetype: 'Seeker',
    description: 'You are on a quest for meaning, truth, and deeper understanding. Your dreams reflect a soul searching for answers and purpose.',
    characteristics: ['Reflective', 'Purposeful', 'Questioning', 'Determined'],
  },
  Protector: {
    archetype: 'Protector',
    description: 'Your dreams show a deep care for safety, stability, and the well-being of yourself and others. You create sanctuaries in your inner world.',
    characteristics: ['Caring', 'Grounded', 'Nurturing', 'Responsible'],
  },
  'Shadow Walker': {
    archetype: 'Shadow Walker',
    description: 'You courageously explore the deeper, more mysterious aspects of your inner world. Your dreams reveal hidden truths and unspoken feelings.',
    characteristics: ['Brave', 'Introspective', 'Mysterious', 'Transformative'],
  },
  Creator: {
    archetype: 'Creator',
    description: 'Your dreams are canvases of creation, where ideas, art, and new possibilities come to life. You transform thoughts into visions.',
    characteristics: ['Artistic', 'Innovative', 'Expressive', 'Inspiring'],
  },
}

/**
 * Determine archetype from themes and emotions
 */
export function determineArchetype(
  dominantThemes: string[],
  dominantEmotion: string,
  avgIntensity: number
): ArchetypeData {
  const themes = dominantThemes.map(t => t.toLowerCase())
  const emotion = dominantEmotion.toLowerCase()

  // Theme-based matching
  if (themes.some(t => t.includes('freedom') || t.includes('exploration') || t.includes('journey'))) {
    return ARCHETYPE_DEFINITIONS['Explorer']
  }

  if (themes.some(t => t.includes('uncertainty') || t.includes('darkness') || t.includes('shadow'))) {
    return ARCHETYPE_DEFINITIONS['Shadow Walker']
  }

  if (themes.some(t => t.includes('transformation') || t.includes('growth') || t.includes('creation'))) {
    return ARCHETYPE_DEFINITIONS['Creator']
  }

  if (themes.some(t => t.includes('connection') || t.includes('relationship') || t.includes('stability'))) {
    return ARCHETYPE_DEFINITIONS['Protector']
  }

  if (themes.some(t => t.includes('clarity') || t.includes('meaning') || t.includes('truth'))) {
    return ARCHETYPE_DEFINITIONS['Seeker']
  }

  // Emotion-based matching
  if (emotion === 'hopeful' && avgIntensity < 0.6) {
    return ARCHETYPE_DEFINITIONS['Dreamer']
  }

  if (emotion === 'anxious' || emotion === 'dark') {
    return ARCHETYPE_DEFINITIONS['Shadow Walker']
  }

  if (emotion === 'intense' && avgIntensity > 0.7) {
    return ARCHETYPE_DEFINITIONS['Creator']
  }

  if (emotion === 'calm' && avgIntensity < 0.4) {
    return ARCHETYPE_DEFINITIONS['Protector']
  }

  // Default to Dreamer
  return ARCHETYPE_DEFINITIONS['Dreamer']
}

/**
 * Get all archetype definitions
 */
export function getAllArchetypes(): Record<DreamArchetype, ArchetypeData> {
  return ARCHETYPE_DEFINITIONS
}

