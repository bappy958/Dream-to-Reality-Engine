'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// Emotion data for visualizations
const emotionData: Record<string, { icon: string; color: string; gradient: string; glow: string }> = {
  anxious: { icon: '😰', color: 'from-red-500 to-orange-500', gradient: 'bg-gradient-to-r from-red-500 to-orange-500', glow: 'rgba(239, 68, 68, 0.3)' },
  emotional: { icon: '💔', color: 'from-pink-500 to-rose-500', gradient: 'bg-gradient-to-r from-pink-500 to-rose-500', glow: 'rgba(236, 72, 153, 0.3)' },
  hopeful: { icon: '🌟', color: 'from-yellow-400 to-orange-400', gradient: 'bg-gradient-to-r from-yellow-400 to-orange-400', glow: 'rgba(251, 191, 36, 0.3)' },
  calm: { icon: '🧘', color: 'from-blue-400 to-cyan-400', gradient: 'bg-gradient-to-r from-blue-400 to-cyan-400', glow: 'rgba(56, 189, 248, 0.3)' },
  dark: { icon: '🌑', color: 'from-gray-700 to-gray-900', gradient: 'bg-gradient-to-r from-gray-700 to-gray-900', glow: 'rgba(75, 85, 99, 0.3)' },
  intense: { icon: '⚡', color: 'from-purple-600 to-pink-600', gradient: 'bg-gradient-to-r from-purple-600 to-pink-600', glow: 'rgba(168, 85, 247, 0.3)' },
}

const mentalStateConfig: Record<string, { label: string; gradient: string; icon: string; description: string }> = {
  Calm: {
    label: 'Calm',
    gradient: 'from-blue-400 via-cyan-400 to-teal-400',
    icon: '🌊',
    description: 'Peaceful and balanced',
  },
  Mixed: {
    label: 'Mixed',
    gradient: 'from-purple-400 via-pink-400 to-rose-400',
    icon: '🌈',
    description: 'A blend of emotions',
  },
  Healing: {
    label: 'Healing',
    gradient: 'from-green-400 via-emerald-400 to-teal-400',
    icon: '🌱',
    description: 'Growing and transforming',
  },
  Stressed: {
    label: 'Stressed',
    gradient: 'from-orange-400 via-red-400 to-rose-400',
    icon: '🌪️',
    description: 'Navigating challenges',
  },
}

interface MonthlyReport {
  mental_state: string | null
  summary: string | null
  patterns: string[] | string | null
  recommendation: string | null
  month_year: string
  dominant_themes?: string[] | string | null
  theme_explanation?: string | null
  archetype?: string | null
  evolution_summary?: string | null
}

interface Dream {
  id: string
  dream_text: string
  emotion: string | null
  style: string | null
  analysis: any
  created_at: string
}

export default function DashboardPage() {
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(null)
  const [dreams, setDreams] = useState<Dream[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDream, setSelectedDream] = useState<string | null>(null)

  // Fetch monthly report and dreams
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch monthly report
        const reportRes = await fetch('/api/reports/monthly')
        if (reportRes.ok) {
          const reportData = await reportRes.json()
          if (reportData.success && reportData.report) {
            setMonthlyReport(reportData.report)
          }
        }

        // Fetch dreams
        const dreamsRes = await fetch('/api/dreams')
        if (dreamsRes.ok) {
          const dreamsData = await dreamsRes.json()
          if (dreamsData.success && dreamsData.dreams) {
            setDreams(dreamsData.dreams)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate emotion distribution
  const emotionCounts = dreams.reduce((acc, dream) => {
    const emotion = dream.emotion || 'unknown'
    acc[emotion] = (acc[emotion] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalDreams = dreams.length
  const emotionValues = Object.values(emotionCounts)
  const maxEmotionCount = emotionValues.length > 0 ? Math.max(...emotionValues) : 1

  // Generate calendar heatmap data (last 30 days)
  const generateHeatmapData = () => {
    const days: Array<{ date: Date; count: number; intensity: number }> = []
    const today = new Date()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayDreams = dreams.filter(dream => {
        const dreamDate = new Date(dream.created_at).toISOString().split('T')[0]
        return dreamDate === dateStr
      })
      
      const count = dayDreams.length
      days.push({
        date,
        count,
        intensity: Math.min(count / 3, 1), // Normalize to 0-1
      })
    }
    
    return days
  }

  const heatmapData = generateHeatmapData()
  const maxDayCount = Math.max(...heatmapData.map(d => d.count), 1)

  const mentalState = monthlyReport?.mental_state || 'Mixed'
  const stateConfig = mentalStateConfig[mentalState] || mentalStateConfig['Mixed']

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617] text-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617] text-white relative overflow-hidden">
      {/* Dynamic background based on mental state */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          background: `radial-gradient(circle at 30% 50%, ${
            mentalState === 'Calm' ? 'rgba(56, 189, 248, 0.15)' :
            mentalState === 'Healing' ? 'rgba(34, 197, 94, 0.15)' :
            mentalState === 'Stressed' ? 'rgba(249, 115, 22, 0.15)' :
            'rgba(168, 85, 247, 0.15)'
          }), radial-gradient(circle at 70% 50%, ${
            mentalState === 'Calm' ? 'rgba(6, 182, 212, 0.1)' :
            mentalState === 'Healing' ? 'rgba(20, 184, 166, 0.1)' :
            mentalState === 'Stressed' ? 'rgba(239, 68, 68, 0.1)' :
            'rgba(236, 72, 153, 0.1)'
          }), transparent 50%`,
        }}
      />

      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617]" />

      {/* Animated glow orbs */}
      <motion.div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, -50, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Inner World</span>
          </h1>
          <p className="text-gray-300 text-lg">A gentle reflection on your dream journey</p>
        </motion.div>

        {/* 1. Dashboard Hero: Mind Weather */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-strong rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden"
        >
          {/* Animated background particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <motion.div
                  className="text-6xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {stateConfig.icon}
                </motion.div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">
                    Mind Weather: <span className={`text-transparent bg-clip-text bg-gradient-to-r ${stateConfig.gradient}`}>
                      {stateConfig.label}
                    </span>
                  </h2>
                  <p className="text-gray-300">{stateConfig.description}</p>
                </div>
              </div>
              
              {/* Feature 6: Archetype Badge */}
              {monthlyReport?.archetype && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.05 }}
                  className="glass-strong rounded-2xl p-4 border-2 border-purple-400/50 relative overflow-hidden cursor-pointer group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20"
                    animate={{
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <div className="relative z-10 text-center">
                    <motion.div
                      className="text-3xl mb-2"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      ✨
                    </motion.div>
                    <div className="text-sm font-semibold text-purple-300">{monthlyReport.archetype}</div>
                    <div className="text-xs text-gray-400 mt-1">Your Archetype</div>
                  </div>
                </motion.div>
              )}
            </div>

            {monthlyReport?.summary && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-gray-300 leading-relaxed italic"
              >
                {monthlyReport.summary}
              </motion.p>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 2. Emotional Balance Meter */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-strong rounded-3xl p-6 md:p-8"
          >
            <h3 className="text-2xl font-semibold mb-6">Emotional Balance</h3>
            {totalDreams === 0 ? (
              <p className="text-gray-400 text-center py-8">No dreams recorded yet</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(emotionCounts).map(([emotion, count], index) => {
                  const emotionInfo = emotionData[emotion] || emotionData['hopeful']
                  const percentage = (count / maxEmotionCount) * 100
                  
                  return (
                    <motion.div
                      key={emotion}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{emotionInfo.icon}</span>
                          <span className="font-medium capitalize">{emotion}</span>
                        </div>
                        <span className="text-sm text-gray-400">{count}</span>
                      </div>
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${emotionInfo.gradient} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: 'easeOut' }}
                        />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>

          {/* 3. Dream Frequency Heatmap */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-strong rounded-3xl p-6 md:p-8"
          >
            <h3 className="text-2xl font-semibold mb-6">Dream Frequency</h3>
            {totalDreams === 0 ? (
              <p className="text-gray-400 text-center py-8">No dreams recorded yet</p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-2">
                  {heatmapData.map((day, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.01 }}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                      className="relative group"
                    >
                      <div
                        className={`aspect-square rounded-lg border-2 transition-all ${
                          day.count > 0
                            ? `border-purple-400/50 bg-gradient-to-br from-purple-500/20 to-cyan-500/20`
                            : 'border-white/10 bg-white/5'
                        }`}
                        style={{
                          opacity: day.count > 0 ? 0.3 + day.intensity * 0.7 : 0.2,
                        }}
                      />
                      {/* Tooltip */}
                      {day.count > 0 && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                          {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: {day.count} dream{day.count !== 1 ? 's' : ''}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Less</span>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className="w-3 h-3 rounded border border-white/20"
                        style={{
                          opacity: 0.2 + (level / 3) * 0.8,
                          background: level > 0 ? `linear-gradient(135deg, rgba(139, 92, 246, ${0.3 + level * 0.2}), rgba(6, 182, 212, ${0.3 + level * 0.2}))` : 'transparent',
                        }}
                      />
                    ))}
                  </div>
                  <span>More</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 4. Monthly Insight Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-strong rounded-3xl p-6 md:p-8 border-l-4 border-purple-400/50"
          >
            <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Monthly Insight
            </h3>
            {monthlyReport?.summary ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-gray-300 leading-relaxed text-lg"
              >
                {monthlyReport.summary}
              </motion.p>
            ) : (
              <p className="text-gray-400 italic">Your monthly insights will appear here once you have more dreams.</p>
            )}

            {(() => {
              let patterns: string[] = []
              
              if (monthlyReport?.patterns) {
                if (Array.isArray(monthlyReport.patterns)) {
                  patterns = monthlyReport.patterns
                } else if (typeof monthlyReport.patterns === 'string') {
                  try {
                    const parsed = JSON.parse(monthlyReport.patterns)
                    patterns = Array.isArray(parsed) ? parsed : []
                  } catch (error) {
                    console.error('Error parsing patterns:', error)
                    patterns = []
                  }
                }
              }

              return patterns.length > 0 ? (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-3">Recurring Patterns</h4>
                  <div className="flex flex-wrap gap-2">
                    {patterns.map((pattern, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm"
                      >
                        {pattern}
                      </motion.span>
                    ))}
                  </div>
                </div>
              ) : null
            })()}

            {/* Feature 4: Subconscious Themes */}
            {(() => {
              let themes: string[] = []
              
              if (monthlyReport?.dominant_themes) {
                if (Array.isArray(monthlyReport.dominant_themes)) {
                  themes = monthlyReport.dominant_themes
                } else if (typeof monthlyReport.dominant_themes === 'string') {
                  try {
                    const parsed = JSON.parse(monthlyReport.dominant_themes)
                    themes = Array.isArray(parsed) ? parsed : []
                  } catch (error) {
                    console.error('Error parsing dominant_themes:', error)
                    themes = []
                  }
                }
              }

              return themes.length > 0 ? (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-3 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Subconscious Themes
                  </h4>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {themes.map((theme: string, i: number) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.8 + i * 0.1, type: 'spring' }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-2 border-purple-400/50 text-sm font-medium relative overflow-hidden group"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-cyan-500/30"
                          animate={{
                            opacity: [0.3, 0.6, 0.3],
                          }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                        />
                        <span className="relative z-10">{theme}</span>
                      </motion.span>
                    ))}
                  </div>
                  {monthlyReport?.theme_explanation && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="text-sm text-gray-300 italic leading-relaxed"
                    >
                      {monthlyReport.theme_explanation}
                    </motion.p>
                  )}
                </div>
              ) : null
            })()}
          </motion.div>

          {/* 5. Gentle Recommendation Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="glass-strong rounded-3xl p-6 md:p-8 border-l-4 border-cyan-400/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="text-3xl"
              >
                💫
              </motion.div>
              <h3 className="text-2xl font-semibold">Gentle Suggestion</h3>
            </div>
            {monthlyReport?.recommendation ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-gray-300 leading-relaxed"
              >
                {monthlyReport.recommendation}
              </motion.p>
            ) : (
              <p className="text-gray-400 italic">Keep writing your dreams. Each one adds to your inner landscape.</p>
            )}
          </motion.div>
        </div>

        {/* Feature 6: Archetype Detail Card */}
        {monthlyReport?.archetype && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="glass-strong rounded-3xl p-6 md:p-8 mb-8 border-2 border-purple-400/30 relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-purple-500/10"
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  className="text-5xl"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  ✨
                </motion.div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {monthlyReport.archetype}
                  </h3>
                  <p className="text-gray-400 text-sm">Your Dream Archetype</p>
                </div>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-gray-300 leading-relaxed text-lg italic"
              >
                {(() => {
                  const archetypeDescriptions: Record<string, string> = {
                    'Dreamer': 'You navigate worlds of possibility, where imagination and reality blend into beautiful visions. Your dreams are gateways to what could be.',
                    'Explorer': 'Your dreams are journeys into unknown territories. You seek new experiences, understanding, and perspectives in your inner landscape.',
                    'Seeker': 'You are on a quest for meaning, truth, and deeper understanding. Your dreams reflect a soul searching for answers and purpose.',
                    'Protector': 'Your dreams show a deep care for safety, stability, and the well-being of yourself and others. You create sanctuaries in your inner world.',
                    'Shadow Walker': 'You courageously explore the deeper, more mysterious aspects of your inner world. Your dreams reveal hidden truths and unspoken feelings.',
                    'Creator': 'Your dreams are canvases of creation, where ideas, art, and new possibilities come to life. You transform thoughts into visions.',
                  }
                  return archetypeDescriptions[monthlyReport.archetype] || 'Your dreams reflect a unique inner landscape.'
                })()}
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Feature 5: Dream Evolution Timeline */}
        {monthlyReport?.evolution_summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="glass-strong rounded-3xl p-6 md:p-8 mb-8"
          >
            <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Dream Evolution
            </h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-gray-300 leading-relaxed mb-6"
            >
              {monthlyReport.evolution_summary}
            </motion.p>
            {/* Visual evolution curve placeholder */}
            <div className="relative h-32 rounded-xl bg-gradient-to-r from-purple-900/20 via-cyan-900/20 to-purple-900/20 border border-white/10 overflow-hidden">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                <motion.path
                  d="M 0,80 Q 100,60 200,50 T 400,40"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 pb-2 text-xs text-gray-400">
                <span>Past</span>
                <span>Present</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* 6. Dream Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="glass-strong rounded-3xl p-6 md:p-8"
        >
          <h3 className="text-2xl font-semibold mb-6">Dream Timeline</h3>
          {dreams.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✨</div>
              <h4 className="text-xl font-semibold mb-2">No dreams yet</h4>
              <p className="text-gray-300 mb-6">Start your journey by writing your first dream</p>
              <Link href="/compose">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 font-semibold"
                >
                  Write Your First Dream
                </motion.button>
              </Link>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/50 via-cyan-500/50 to-transparent" />

              <div className="space-y-6">
                {dreams.slice(0, 10).map((dream, index) => {
                  const emotion = dream.emotion || 'hopeful'
                  const emotionInfo = emotionData[emotion] || emotionData['hopeful']
                  const date = new Date(dream.created_at)
                  const isSelected = selectedDream === dream.id

                  return (
                    <motion.div
                      key={dream.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="relative pl-20"
                    >
                      {/* Timeline node */}
                      <motion.div
                        className={`absolute left-6 w-4 h-4 rounded-full border-2 border-white/20 ${emotionInfo.gradient} z-10`}
                        whileHover={{ scale: 1.5 }}
                        animate={{
                          boxShadow: isSelected
                            ? [`0 0 20px ${emotionInfo.glow}`, `0 0 40px ${emotionInfo.glow}`, `0 0 20px ${emotionInfo.glow}`]
                            : '0 0 0px rgba(0,0,0,0)',
                        }}
                        transition={{ duration: 2, repeat: isSelected ? Infinity : 0 }}
                      />

                      {/* Dream card */}
                      <Link href={`/dream/${dream.id}`}>
                        <motion.div
                          onClick={() => setSelectedDream(dream.id)}
                          whileHover={{ x: 10, scale: 1.02 }}
                          className={`glass rounded-2xl p-5 border-2 cursor-pointer transition-all ${
                            isSelected ? 'border-purple-400/50 bg-white/10' : 'border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{emotionInfo.icon}</span>
                              <div>
                                <div className="font-semibold capitalize">{emotion}</div>
                                <div className="text-sm text-gray-400">
                                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                              </div>
                            </div>
                            {dream.style && (
                              <span className="text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/20">
                                {dream.style}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-300 line-clamp-2">
                            {dream.dream_text.substring(0, 150)}
                            {dream.dream_text.length > 150 ? '...' : ''}
                          </p>
                        </motion.div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
