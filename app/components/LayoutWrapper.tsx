'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface LayoutWrapperProps {
  children: ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  // Enhanced floating ambient motion elements variants
  const floatingVariants1 = {
    animate: {
      y: [0, -40, 0],
      x: [0, 25, 0],
      rotate: [0, 8, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: [0.4, 0, 0.6, 1],
      },
    },
  }

  const floatingVariants2 = {
    animate: {
      y: [0, 30, 0],
      x: [0, -20, 0],
      rotate: [0, -8, 0],
      scale: [1, 1.15, 1],
      transition: {
        duration: 12,
        repeat: Infinity,
        ease: [0.4, 0, 0.6, 1],
        delay: 1.5,
      },
    },
  }

  const floatingVariants3 = {
    animate: {
      y: [0, -25, 0],
      x: [0, 15, 0],
      rotate: [0, 5, 0],
      scale: [1, 1.08, 1],
      transition: {
        duration: 14,
        repeat: Infinity,
        ease: [0.4, 0, 0.6, 1],
        delay: 3,
      },
    },
  }

  const floatingVariants4 = {
    animate: {
      y: [0, 35, 0],
      x: [0, -18, 0],
      rotate: [0, -6, 0],
      scale: [1, 1.12, 1],
      transition: {
        duration: 16,
        repeat: Infinity,
        ease: [0.4, 0, 0.6, 1],
        delay: 2,
      },
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex flex-col relative overflow-hidden"
    >
      {/* Enhanced animated gradient background with more layers */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-blue-900/60 to-indigo-900/60" />
        
        {/* Animated layer 1 */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-purple-800/50 via-blue-800/50 to-cyan-800/50"
          animate={{
            opacity: [0.4, 0.7, 0.4],
            scale: [1, 1.08, 1],
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1],
          }}
        />
        
        {/* Animated layer 2 */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-bl from-indigo-800/40 via-purple-800/40 to-pink-800/40"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1.08, 1, 1.08],
            x: [0, -15, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1],
            delay: 2.5,
          }}
        />
        
        {/* Additional depth layer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-800/20 via-transparent to-purple-800/20"
          animate={{
            opacity: [0.2, 0.4, 0.2],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1],
            delay: 1,
          }}
        />
      </div>

      {/* Enhanced floating ambient motion elements with more variety */}
      <motion.div
        className="absolute top-16 left-8 sm:left-12 md:left-16 w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 bg-purple-500/25 rounded-full blur-3xl"
        variants={floatingVariants1}
        animate="animate"
      />
      <motion.div
        className="absolute top-1/4 right-12 sm:right-16 md:right-24 w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52 bg-blue-500/25 rounded-full blur-3xl"
        variants={floatingVariants2}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-1/3 left-1/5 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-cyan-500/25 rounded-full blur-3xl"
        variants={floatingVariants3}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-16 right-1/4 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-indigo-500/25 rounded-full blur-2xl"
        variants={floatingVariants4}
        animate="animate"
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-purple-400/20 rounded-full blur-2xl"
        variants={floatingVariants1}
        animate="animate"
      />
      <motion.div
        className="absolute top-3/4 right-1/3 w-18 h-18 sm:w-26 sm:h-26 md:w-30 md:h-30 bg-pink-500/20 rounded-full blur-2xl"
        variants={floatingVariants3}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-1/4 right-1/5 w-22 h-22 sm:w-30 sm:h-30 md:w-36 md:h-36 bg-cyan-400/20 rounded-full blur-3xl"
        variants={floatingVariants2}
        animate="animate"
      />

      {/* Enhanced glassmorphism wrapper with better effects */}
      <div className="relative z-0 min-h-screen flex flex-col">
        {/* Multi-layer glassmorphism effect */}
        <div className="absolute inset-0 backdrop-blur-md bg-black/15 pointer-events-none" />
        <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-b from-black/5 via-transparent to-black/10 pointer-events-none" />
        
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Content wrapper with proper spacing */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </div>
    </motion.div>
  )
}

