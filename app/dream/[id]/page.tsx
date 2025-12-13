'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'

const emotionData: Record<string, { icon: string; gradient: string; glow: string }> = {
  anxious: { icon: '😰', gradient: 'from-red-500 to-orange-500', glow: 'rgba(239, 68, 68, 0.3)' },
  emotional: { icon: '💔', gradient: 'from-pink-500 to-rose-500', glow: 'rgba(236, 72, 153, 0.3)' },
  hopeful: { icon: '🌟', gradient: 'from-yellow-400 to-orange-400', glow: 'rgba(251, 191, 36, 0.3)' },
  calm: { icon: '🧘', gradient: 'from-blue-400 to-cyan-400', glow: 'rgba(56, 189, 248, 0.3)' },
  dark: { icon: '🌑', gradient: 'from-gray-700 to-gray-900', glow: 'rgba(75, 85, 99, 0.3)' },
  intense: { icon: '⚡', gradient: 'from-purple-600 to-pink-600', glow: 'rgba(168, 85, 247, 0.3)' },
}

interface Dream {
  id: string
  dream_text: string
  emotion: string | null
  style: string | null
  analysis: any
  created_at: string
  video_url?: string | null
  video_status?: string | null
  video_prompt?: string | null
}

export default function DreamPage() {
  const params = useParams()
  const id = params.id as string

  const [dream, setDream] = useState<Dream | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [videoStatus, setVideoStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch dream data
  useEffect(() => {
    const fetchDream = async () => {
      try {
        const res = await fetch(`/api/dreams?id=${id}`)
        if (!res.ok) {
          throw new Error(`Failed to fetch dream: ${res.status}`)
        }
        const data = await res.json()
        if (data.success && data.dreams && data.dreams.length > 0) {
          setDream(data.dreams[0])
          setVideoStatus(data.dreams[0].video_status || null)
        } else if (data.success && data.dream) {
          // Handle single dream response format
          setDream(data.dream)
          setVideoStatus(data.dream.video_status || null)
        } else {
          setError('Dream not found')
        }
      } catch (err) {
        console.error('Error fetching dream:', err)
        setError(err instanceof Error ? err.message : 'Failed to load dream')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchDream()
    }
  }, [id])

  // Poll video status if generating (with timeout safety)
  useEffect(() => {
    const currentStatus = videoStatus || dream?.video_status
    
    // Don't poll if not generating or already completed/failed
    if (!generating && currentStatus !== 'processing' && currentStatus !== 'pending') {
      return
    }

    let pollCount = 0
    const maxPolls = 120 // 5 minutes max (120 * 2.5s = 300s)
    let timeoutId: NodeJS.Timeout

    const pollStatus = async () => {
      try {
        pollCount++
        
        // Timeout after max polls
        if (pollCount > maxPolls) {
          setError('Video generation is taking longer than expected. Please refresh the page.')
          setGenerating(false)
          return
        }

        const res = await fetch(`/api/dreams/video-status?dream_id=${id}`)
        
        if (!res.ok) {
          throw new Error('Failed to check video status')
        }

        const data = await res.json()
        
        if (data.success) {
          const newStatus = data.video_status
          setVideoStatus(newStatus)
          
          if (data.video_url) {
            setDream(prev => prev ? {
              ...prev,
              video_url: data.video_url,
              video_status: newStatus,
            } : null)
          }

          // Stop polling if completed or failed
          if (newStatus === 'completed' || newStatus === 'failed') {
            setGenerating(false)
            if (newStatus === 'failed' && (data.video_error || data.error)) {
              setError(data.video_error || data.error || 'Video generation failed')
            }
            return
          }

          // Continue polling if still processing
          if (newStatus === 'processing' || newStatus === 'pending') {
            timeoutId = setTimeout(pollStatus, 2500) // Poll every 2.5 seconds
          }
        }
      } catch (err) {
        console.error('Error checking video status:', err)
        // Retry after delay on error
        timeoutId = setTimeout(pollStatus, 5000) // Retry after 5 seconds on error
      }
    }

    // Start polling
    timeoutId = setTimeout(pollStatus, 2500) // Initial delay

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [generating, videoStatus, dream?.video_status, id])

  const handleGenerateVideo = async () => {
    if (!dream) return

    setGenerating(true)
    setError(null)

    try {
      const res = await fetch('/api/dreams/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dream_id: id,
          style: dream.style,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to generate video')
      }

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate video')
      }

      if (data.success) {
        setVideoStatus(data.video_status)
        setDream(prev => prev ? {
          ...prev,
          video_id: data.video_id,
          video_status: data.video_status,
          video_prompt: data.video_prompt,
          video_url: data.video_url,
        } : null)

        // Always start polling if status is pending/processing
        if (data.video_status === 'pending' || data.video_status === 'processing') {
          setGenerating(true) // Ensure polling starts
        } else if (data.video_status === 'completed') {
          setGenerating(false)
        } else if (data.video_status === 'failed') {
          setGenerating(false)
          setError('Video generation failed. Please try again.')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate video')
      setGenerating(false)
    }
  }

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

  if (!dream) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Dream not found</h2>
          <Link href="/dashboard" className="text-purple-400 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const emotion = dream.emotion || 'hopeful'
  const emotionInfo = emotionData[emotion] || emotionData['hopeful']
  const analysis = dream.analysis || {}
  const currentVideoStatus = videoStatus || dream.video_status

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617] text-white relative overflow-hidden">
      {/* Dynamic emotion-based background glow */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: `radial-gradient(circle at 30% 50%, ${emotionInfo.glow}, transparent 50%),
                       radial-gradient(circle at 70% 50%, ${emotionInfo.glow}40, transparent 50%)`,
        }}
        transition={{ duration: 2 }}
      />

      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617]" />

      {/* Animated glow orbs */}
      <motion.div
        className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[80px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 group"
          >
            <motion.span
              animate={{ x: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ←
            </motion.span>
            <span className="group-hover:underline">Back to Dashboard</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Video */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video preview container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-strong rounded-3xl p-6 relative overflow-hidden"
            >
              {/* Emotion-based glow effect */}
              <motion.div
                className="absolute inset-0 rounded-3xl opacity-0"
                animate={{
                  opacity: currentVideoStatus === 'processing' ? 0.3 : 0,
                  background: `linear-gradient(135deg, ${emotionInfo.glow}, transparent)`,
                }}
                transition={{ duration: 2, repeat: currentVideoStatus === 'processing' ? Infinity : 0 }}
              />

              <h2 className="text-2xl font-semibold mb-4 relative z-10">Dream Film</h2>

              <AnimatePresence mode="wait">
                {dream.video_url && currentVideoStatus === 'completed' ? (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="aspect-video rounded-xl overflow-hidden border-2 border-purple-400/50 relative z-10"
                  >
                    <video
                      src={dream.video_url}
                      controls
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                    />
                  </motion.div>
                ) : currentVideoStatus === 'processing' || generating ? (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="aspect-video rounded-xl bg-gradient-to-br from-purple-900/50 to-cyan-900/50 flex items-center justify-center border-2 border-purple-400/50 relative z-10"
                  >
                    <div className="text-center space-y-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-16 h-16 mx-auto border-4 border-purple-400/30 border-t-purple-400 rounded-full"
                      />
                      <div>
                        <p className="text-white/90 font-semibold">Creating your dream film...</p>
                        <p className="text-sm text-white/60 mt-2">This may take a few minutes</p>
                      </div>
                    </div>
                  </motion.div>
                ) : currentVideoStatus === 'pending' ? (
                  <motion.div
                    key="pending"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="aspect-video rounded-xl bg-gradient-to-br from-purple-900/50 to-cyan-900/50 flex items-center justify-center border-2 border-purple-400/30 relative z-10"
                  >
                    <div className="text-center space-y-4">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-6xl"
                      >
                        🎬
                      </motion.div>
                      <div>
                        <p className="text-white/90 font-semibold">Video generation queued</p>
                        <p className="text-sm text-white/60 mt-2">Your request is in the queue...</p>
                      </div>
                    </div>
                  </motion.div>
                ) : currentVideoStatus === 'failed' ? (
                  <motion.div
                    key="failed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="aspect-video rounded-xl bg-gradient-to-br from-red-900/30 to-orange-900/30 flex items-center justify-center border-2 border-red-500/50 relative z-10"
                  >
                    <div className="text-center space-y-4">
                      <div className="text-6xl">⚠️</div>
                      <div>
                        <p className="text-white/90 font-semibold">Generation Failed</p>
                        <p className="text-sm text-white/60 mt-2">Please try again</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="aspect-video rounded-xl bg-gradient-to-br from-purple-900/50 to-cyan-900/50 flex items-center justify-center border border-white/10 relative z-10"
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎬</div>
                      <p className="text-white/70">No video generated yet</p>
                      <p className="text-sm text-white/50 mt-2">Click "Generate Dream Film" to create</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm relative z-10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold mb-1">Error</p>
                      <p>{error}</p>
                    </div>
                    {(currentVideoStatus === 'failed' || error.includes('failed')) && (
                      <motion.button
                        onClick={handleGenerateVideo}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-sm font-medium transition-colors"
                      >
                        Retry
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Right column - Analysis panel */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-strong rounded-3xl p-6"
            >
              <h2 className="text-2xl font-semibold mb-4">Dream Details</h2>
              <p className="text-white/60 text-sm mb-6">
                {new Date(dream.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">What Your Dream Reflects</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {analysis.overall_tone
                      ? `Your dream carries a ${analysis.overall_tone} tone, reflecting ${analysis.primary_emotion || emotion} emotions. ${dream.dream_text.substring(0, 100)}...`
                      : dream.dream_text.substring(0, 200) + (dream.dream_text.length > 200 ? '...' : '')}
                  </p>
                </div>

                {/* Emotion & mood badges */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-white/80">Emotion & Mood</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${emotionInfo.gradient} text-black text-xs font-medium`}>
                      {emotionData[emotion]?.icon} {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                    </span>
                    {analysis.symbols && analysis.symbols.slice(0, 3).map((symbol: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs"
                      >
                        {symbol}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Style badge */}
                {dream.style && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-white/80">Video Style</h4>
                    <span className="inline-block px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-sm font-medium">
                      🎬 {dream.style.charAt(0).toUpperCase() + dream.style.slice(1)}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-3"
            >
              <motion.button
                onClick={handleGenerateVideo}
                disabled={generating || currentVideoStatus === 'processing' || currentVideoStatus === 'pending'}
                whileHover={!generating && currentVideoStatus !== 'processing' && currentVideoStatus !== 'pending' ? { scale: 1.02 } : {}}
                whileTap={!generating && currentVideoStatus !== 'processing' && currentVideoStatus !== 'pending' ? { scale: 0.98 } : {}}
                className={`relative w-full py-4 rounded-xl font-semibold overflow-hidden group ${
                  generating || currentVideoStatus === 'processing' || currentVideoStatus === 'pending'
                    ? 'opacity-50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:shadow-lg hover:shadow-purple-500/50'
                }`}
              >
                {/* Animated gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100"
                  animate={{
                    backgroundPosition: ['0%', '100%', '0%'],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  animate={{
                    boxShadow: [
                      `0 0 20px ${emotionInfo.glow}`,
                      `0 0 40px ${emotionInfo.glow}`,
                      `0 0 20px ${emotionInfo.glow}`,
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {generating || currentVideoStatus === 'processing' || currentVideoStatus === 'pending' ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Generating...
                    </>
                  ) : dream.video_url ? (
                    <>
                      ✨ Regenerate Dream Film
                    </>
                  ) : (
                    <>
                      ✨ Generate Dream Film
                    </>
                  )}
                </span>
              </motion.button>

              {dream.video_url && (
                <motion.a
                  href={dream.video_url}
                  download
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="block w-full py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-colors text-center"
                >
                  Download Video
                </motion.a>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
              >
                Share Dream
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
