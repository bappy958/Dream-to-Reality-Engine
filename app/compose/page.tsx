'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const emotions = [
  { id: 'anxious', label: 'Anxious', icon: '😰', color: 'from-red-500 to-orange-500', glow: 'rgba(239, 68, 68, 0.3)' },
  { id: 'emotional', label: 'Emotional', icon: '💔', color: 'from-pink-500 to-rose-500', glow: 'rgba(236, 72, 153, 0.3)' },
  { id: 'hopeful', label: 'Hopeful', icon: '🌟', color: 'from-yellow-400 to-orange-400', glow: 'rgba(251, 191, 36, 0.3)' },
  { id: 'calm', label: 'Calm', icon: '🧘', color: 'from-blue-400 to-cyan-400', glow: 'rgba(56, 189, 248, 0.3)' },
  { id: 'dark', label: 'Dark', icon: '🌑', color: 'from-gray-700 to-gray-900', glow: 'rgba(75, 85, 99, 0.3)' },
  { id: 'intense', label: 'Intense', icon: '⚡', color: 'from-purple-600 to-pink-600', glow: 'rgba(168, 85, 247, 0.3)' },
]

const videoStyles = [
  {
    id: 'cinematic',
    label: 'Cinematic',
    desc: 'Hollywood-style dramatic visuals',
    gradient: 'from-purple-600 via-blue-600 to-cyan-600',
    icon: '🎬',
  },
  {
    id: 'anime',
    label: 'Anime',
    desc: 'Vibrant animated art style',
    gradient: 'from-pink-500 via-purple-500 to-indigo-500',
    icon: '🎨',
  },
  {
    id: 'realistic',
    label: 'Realistic',
    desc: 'Photorealistic scenes',
    gradient: 'from-gray-600 via-gray-700 to-gray-800',
    icon: '📸',
  },
  {
    id: 'fantasy',
    label: 'Fantasy',
    desc: 'Magical and mystical worlds',
    gradient: 'from-purple-500 via-pink-500 to-cyan-500',
    icon: '✨',
  },
  {
    id: 'ai-surreal',
    label: 'AI Surreal',
    desc: 'Dreamlike abstract visuals',
    gradient: 'from-cyan-400 via-purple-400 to-pink-400',
    icon: '🌀',
  },
]

const loadingSteps = [
  'Analyzing your dream...',
  'Extracting emotions and symbols...',
  'Generating AI story...',
  'Creating visual concepts...',
  'Rendering video preview...',
  'Almost there...',
]

export default function ComposePage() {
  const [dreamText, setDreamText] = useState('')
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [showPreview, setShowPreview] = useState(false)

  // Get selected emotion data for mood changes
  const selectedEmotionData = emotions.find(e => e.id === selectedEmotion)

  // Animated background particles
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }))
    setParticles(newParticles)
  }, [])

  // Simulate loading sequence (UI only, no backend calls)
  const handleGenerate = () => {
    if (!dreamText.trim() || !selectedEmotion || !selectedStyle) return

    setIsLoading(true)
    setLoadingStep(0)

    // Step-based progress animation
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(interval)
          setTimeout(() => {
            setIsLoading(false)
            setShowPreview(true)
          }, 1000)
          return prev
        }
        return prev + 1
      })
    }, 1500)
  }

  // Floating placeholder animation
  const [placeholderVisible, setPlaceholderVisible] = useState(true)

  useEffect(() => {
    if (dreamText.length > 0) {
      setPlaceholderVisible(false)
    } else {
      const timer = setTimeout(() => setPlaceholderVisible(true), 300)
      return () => clearTimeout(timer)
    }
  }, [dreamText])

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Dynamic mood background based on selected emotion */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: selectedEmotionData
            ? `radial-gradient(circle at 30% 50%, ${selectedEmotionData.glow}, transparent 50%),
               radial-gradient(circle at 70% 50%, ${selectedEmotionData.glow}40, transparent 50%)`
            : 'radial-gradient(circle at 30% 50%, rgba(139, 92, 246, 0.15), transparent 50%)',
        }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
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

      {/* Floating particles that react to typing */}
      <AnimatePresence>
        {dreamText.length > 0 &&
          particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full blur-sm"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.sin(particle.id) * 20, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: particle.delay,
              }}
            />
          ))}
      </AnimatePresence>

      {/* Fullscreen loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#020617]/95 backdrop-blur-md flex items-center justify-center"
          >
            <div className="text-center space-y-8">
              <motion.div
                className="w-24 h-24 mx-auto relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full" />
                <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full" />
                <div className="absolute inset-0 border-4 border-transparent border-r-cyan-500 rounded-full" style={{ animationDelay: '0.1s' }} />
              </motion.div>

              <motion.div
                key={loadingStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-2"
              >
                <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {loadingSteps[loadingStep]}
                </h3>
                <div className="flex gap-1 justify-center">
                  {loadingSteps.map((_, i) => (
                    <motion.div
                      key={i}
                      className={`h-1 w-8 rounded-full ${
                        i <= loadingStep ? 'bg-gradient-to-r from-purple-500 to-cyan-500' : 'bg-white/10'
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: i <= loadingStep ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 group"
          >
            <motion.span
              animate={{ x: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ←
            </motion.span>
            <span className="group-hover:underline">Back to Home</span>
          </Link>
        </motion.div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div>
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4"
              animate={{
                backgroundPosition: ['0%', '100%', '0%'],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              style={{
                backgroundImage: 'linear-gradient(90deg, #fff, #a78bfa, #06b6d4, #fff)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Write Your Dream
            </motion.h1>
            <p className="text-gray-300 text-lg">
              Express your thoughts, feelings, or visions. Let AI transform them into something beautiful.
            </p>
          </div>

          {/* Enhanced Dream textarea with animated glow */}
          <motion.div
            className="glass-strong rounded-3xl p-6 md:p-8 relative overflow-hidden"
            animate={{
              boxShadow: isFocused
                ? [
                    `0 0 40px ${selectedEmotionData?.glow || 'rgba(139, 92, 246, 0.3)'}`,
                    `0 0 60px ${selectedEmotionData?.glow || 'rgba(139, 92, 246, 0.2)'}`,
                    `0 0 40px ${selectedEmotionData?.glow || 'rgba(139, 92, 246, 0.3)'}`,
                  ]
                : '0 0 0px rgba(139, 92, 246, 0)',
            }}
            transition={{ duration: 2, repeat: isFocused ? Infinity : 0 }}
          >
            {/* Glowing border effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl opacity-0"
              animate={{
                opacity: isFocused ? 0.3 : 0,
                background: selectedEmotionData
                  ? `linear-gradient(135deg, ${selectedEmotionData.glow}, transparent)`
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), transparent)',
              }}
              transition={{ duration: 0.3 }}
            />

            <label htmlFor="dream" className="block text-lg font-semibold mb-4 relative z-10">
              Your Dream
            </label>
            <div className="relative">
              <textarea
                id="dream"
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                rows={10}
                className="w-full px-6 py-6 bg-black/30 backdrop-blur-sm rounded-2xl text-white placeholder-transparent focus:outline-none transition-all resize-none border-2 border-white/10 focus:border-purple-400/50 relative z-10 text-lg leading-relaxed"
                placeholder=""
              />
              {/* Floating animated placeholder */}
              <AnimatePresence>
                {placeholderVisible && dreamText.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: [0.4, 0.6, 0.4], y: [10, 5, 10] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-6 left-6 text-white/40 pointer-events-none z-20 text-lg"
                  >
                    Write your dream, goal, or vision here... Be as detailed or as simple as you want.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.p
              className="text-sm text-white/50 mt-3 relative z-10"
              animate={{ opacity: dreamText.length > 0 ? 1 : 0.5 }}
            >
              {dreamText.length} characters
            </motion.p>
          </motion.div>

          {/* Enhanced Emotion selector with mood-changing effects */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">How does this dream feel?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {emotions.map((emotion, index) => (
                <motion.button
                  key={emotion.id}
                  onClick={() => setSelectedEmotion(emotion.id)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative p-5 rounded-2xl border-2 transition-all overflow-hidden ${
                    selectedEmotion === emotion.id
                      ? `border-transparent bg-gradient-to-br ${emotion.color} shadow-2xl`
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  {/* Visual aura around selected emotion */}
                  {selectedEmotion === emotion.id && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      animate={{
                        boxShadow: [
                          `0 0 20px ${emotion.glow}`,
                          `0 0 40px ${emotion.glow}`,
                          `0 0 20px ${emotion.glow}`,
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  <div className="text-4xl mb-2 relative z-10">{emotion.icon}</div>
                  <div className="text-sm font-medium relative z-10">{emotion.label}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Enhanced Video style selector with 3D tilt effect */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Choose Video Style</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoStyles.map((style, index) => (
                <motion.button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -8,
                    rotateX: 5,
                    rotateY: 5,
                  }}
                  whileTap={{ scale: 0.98 }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className={`relative p-6 rounded-2xl border-2 text-left transition-all overflow-hidden ${
                    selectedStyle === style.id
                      ? `border-transparent bg-gradient-to-br ${style.gradient} shadow-2xl`
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  {/* 3D tilt effect background */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(135deg, ${style.gradient})`,
                      filter: 'blur(20px)',
                    }}
                    whileHover={{ opacity: 0.2 }}
                  />
                  <div className="text-4xl mb-3 relative z-10">{style.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 relative z-10">{style.label}</h3>
                  <p className="text-sm text-white/70 relative z-10">{style.desc}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Enhanced Submit button */}
          <motion.button
            disabled={!dreamText.trim() || !selectedEmotion || !selectedStyle}
            onClick={handleGenerate}
            whileHover={
              dreamText.trim() && selectedEmotion && selectedStyle
                ? { scale: 1.02, boxShadow: '0 0 40px rgba(139, 92, 246, 0.5)' }
                : {}
            }
            whileTap={dreamText.trim() && selectedEmotion && selectedStyle ? { scale: 0.98 } : {}}
            className="relative w-full py-5 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 font-semibold text-lg shadow-lg shadow-purple-500/50 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Animated gradient overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100"
              animate={{
                backgroundPosition: ['0%', '100%', '0%'],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            {/* Ripple effect */}
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 2, opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                ✨
              </motion.span>
              Transform Dream → Reality
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </motion.button>

          {/* Output Preview UI (shown after generation) */}
          <AnimatePresence>
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="mt-12 space-y-8"
              >
                {/* Animated image grid */}
                <div className="glass-strong rounded-3xl p-6 md:p-8">
                  <h3 className="text-2xl font-semibold mb-6">Visual Concepts</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="aspect-square rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 backdrop-blur-sm flex items-center justify-center"
                      >
                        <span className="text-4xl opacity-50">🖼️</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Video preview container */}
                <div className="glass-strong rounded-3xl p-6 md:p-8">
                  <h3 className="text-2xl font-semibold mb-6">Video Preview</h3>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="aspect-video rounded-2xl bg-gradient-to-br from-purple-600/30 via-pink-600/30 to-cyan-600/30 border border-white/10 backdrop-blur-sm flex items-center justify-center relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                    <span className="text-6xl opacity-50 relative z-10">🎬</span>
                  </motion.div>
                </div>

                {/* Dream analysis as poetic text panel */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="glass-strong rounded-3xl p-6 md:p-8 border-l-4 border-purple-400/50"
                >
                  <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    What Your Dream Reflects
                  </h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-gray-300 leading-relaxed text-lg italic"
                  >
                    Your dream carries the gentle weight of {selectedEmotionData?.label.toLowerCase()} emotions,
                    woven into a tapestry of meaning. The symbols that emerge speak to your inner landscape,
                    revealing layers of thought and feeling. This vision reflects a journey of{' '}
                    {selectedEmotionData?.label.toLowerCase()} exploration, where each element holds significance
                    in your personal narrative.
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
