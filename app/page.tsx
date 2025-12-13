'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function DreamEngine() {
  const [dream, setDream] = useState('')
  const [emotion, setEmotion] = useState('Hopeful')
  const [style, setStyle] = useState('Cinematic')

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617] text-white px-6 py-20">

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-extrabold text-center mb-4"
      >
        Dream to Reality <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Engine</span>
      </motion.h1>

      <p className="text-center text-gray-300 mb-12">
        Write your dream. Choose emotion. Let AI turn it into story & video vision.
      </p>

      {/* Dream Input */}
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8">
        <label className="block mb-3 text-lg">✨ Your Dream</label>
        <textarea
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="I want to become successful, build my own company and inspire millions..."
          className="w-full h-32 rounded-2xl bg-black/40 p-4 text-white outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block mb-2">💖 Emotion</label>
            <select
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              className="w-full rounded-xl bg-black/40 p-3"
            >
              <option>Hopeful</option>
              <option>Emotional</option>
              <option>Dark to Light</option>
              <option>Motivational</option>
              <option>Spiritual</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">🎬 Video Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full rounded-xl bg-black/40 p-3"
            >
              <option>Cinematic</option>
              <option>Anime</option>
              <option>Realistic</option>
              <option>Cyberpunk</option>
              <option>Dreamy Fantasy</option>
            </select>
          </div>
        </div>

        <button className="mt-8 w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 font-semibold text-lg hover:scale-105 transition">
          Generate AI Vision ✨
        </button>
      </div>

      {/* AI Preview */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="max-w-5xl mx-auto mt-20"
      >
        <h2 className="text-3xl font-bold mb-6">🔮 AI Generated Preview</h2>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-gray-300 space-y-4">
          <p><strong>Story:</strong> Your dream transforms into a powerful story of struggle, hope, and success.</p>
          <p><strong>Vision:</strong> A cinematic journey from darkness to achievement.</p>
          <p><strong>Video Style:</strong> {style} | Emotion: {emotion}</p>
        </div>
      </motion.section>

      {/* Dashboard Preview */}
      <section className="max-w-6xl mx-auto mt-24">
        <h2 className="text-3xl font-bold mb-6">📁 My Dreams Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-xl font-semibold">Dream #{i}</h3>
              <p className="text-gray-400 mt-2">Emotion: Hopeful</p>
              <p className="text-gray-400">Style: Cinematic</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}