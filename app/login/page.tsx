'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// This page uses fullScreen mode in template, so it has its own background

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailFocused, setEmailFocused] = useState(false)
  const [codeFocused, setCodeFocused] = useState(false)

  // Floating particles animation variants
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      x: [0, 10, 0],
      rotate: [0, 5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  const floatingVariants2 = {
    animate: {
      y: [0, 15, 0],
      x: [0, -10, 0],
      rotate: [0, -5, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 0.5,
      },
    },
  }

  const floatingVariants3 = {
    animate: {
      y: [0, -25, 0],
      x: [0, 15, 0],
      rotate: [0, 10, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 1,
      },
    },
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Animated neon gradient background */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600"
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-bl from-pink-600 via-rose-600 to-cyan-600"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </motion.div>

      {/* Floating animated elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-cyan-400/30 rounded-full blur-xl"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div
        className="absolute top-40 right-20 w-32 h-32 bg-pink-400/30 rounded-full blur-2xl"
        variants={floatingVariants2}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-400/30 rounded-full blur-xl"
        variants={floatingVariants3}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-40 right-1/3 w-28 h-28 bg-blue-400/30 rounded-full blur-2xl"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-16 h-16 bg-indigo-400/30 rounded-full blur-lg"
        variants={floatingVariants2}
        animate="animate"
      />

      {/* Glassmorphism login card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/10 dark:bg-black/20 rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 p-8 md:p-10">
          {/* Glowing border effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-pink-500/50 opacity-0 hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Welcome Back
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center text-white/80 dark:text-gray-300 mb-8 text-sm md:text-base"
          >
            A safe place for your inner world
          </motion.p>

          <form
            className="space-y-6"
            onSubmit={async (e) => {
              e.preventDefault()
              setError(null)
              setLoading(true)

              try {
                if (step === 'email') {
                  // Send OTP
                  const response = await fetch('/api/auth/send-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                  })

                  if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}))
                    throw new Error(errorData.error || 'Failed to send code')
                  }

                  const data = await response.json()

                  setStep('code')
                } else {
                  // Verify OTP
                  const response = await fetch('/api/auth/verify-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, token: code }),
                  })

                  if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}))
                    throw new Error(errorData.error || 'Invalid code')
                  }

                  const data = await response.json()

                  // Success - redirect to dashboard or home
                  router.push('/dashboard')
                  router.refresh()
                }
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Something went wrong')
              } finally {
                setLoading(false)
              }
            }}
          >
            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Email input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/90 dark:text-gray-200 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  disabled={step === 'code' || loading}
                  className="w-full px-4 py-3 bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your email"
                  required
                />
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  animate={{
                    boxShadow: emailFocused
                      ? [
                          '0 0 20px rgba(34, 211, 238, 0.5)',
                          '0 0 40px rgba(34, 211, 238, 0.3)',
                          '0 0 20px rgba(34, 211, 238, 0.5)',
                        ]
                      : '0 0 0px rgba(34, 211, 238, 0)',
                  }}
                  transition={{
                    duration: 2,
                    repeat: emailFocused ? Infinity : 0,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </motion.div>

            {/* OTP Code input (shown after email step) */}
            {step === 'code' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-white/90 dark:text-gray-200 mb-2"
                >
                  Verification Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    onFocus={() => setCodeFocused(true)}
                    onBlur={() => setCodeFocused(false)}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-center text-2xl tracking-widest font-mono"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    animate={{
                      boxShadow: codeFocused
                        ? [
                            '0 0 20px rgba(168, 85, 247, 0.5)',
                            '0 0 40px rgba(168, 85, 247, 0.3)',
                            '0 0 20px rgba(168, 85, 247, 0.5)',
                          ]
                        : '0 0 0px rgba(168, 85, 247, 0)',
                    }}
                    transition={{
                      duration: 2,
                      repeat: codeFocused ? Infinity : 0,
                      ease: 'easeInOut',
                    }}
                  />
                </div>
                <p className="mt-2 text-xs text-white/60 text-center">
                  Check your email for the 6-digit code
                </p>
              </motion.div>
            )}

            {/* Submit button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="relative w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Ripple effect on hover */}
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: loading ? 0 : 2, opacity: [0, 0.5, 0] }}
                transition={{ duration: 0.6 }}
              />
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"
              />
              <span className="relative z-10">
                {loading
                  ? 'Please wait...'
                  : step === 'email'
                    ? 'Send Login Code'
                    : 'Verify & Sign In'}
              </span>
            </motion.button>

            {/* Back to email step */}
            {step === 'code' && (
              <motion.button
                type="button"
                onClick={() => {
                  setStep('email')
                  setCode('')
                  setError(null)
                }}
                className="w-full text-white/70 hover:text-white text-sm transition-colors"
              >
                ← Use a different email
              </motion.button>
            )}
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-6 text-center"
          >
            <Link
              href="/"
              className="text-white/80 hover:text-white transition-colors text-sm md:text-base inline-flex items-center gap-2 group"
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
        </div>
      </motion.div>
    </div>
  )
}


