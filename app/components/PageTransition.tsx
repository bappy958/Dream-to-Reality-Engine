'use client'

/**
 * Global Page Transition Component
 * 
 * Features:
 * - Fade + Slide + Blur animations
 * - Smooth enter/exit transitions
 * - Mobile-optimized (reduced effects for performance)
 * - GPU-accelerated for smooth performance
 * 
 * Usage:
 * - Use directly: <PageTransition>{children}</PageTransition>
 * - With AnimatePresence: <PageTransitionWrapper key={pathname}>{children}</PageTransitionWrapper>
 */

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode, useEffect, useState } from 'react'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export default function PageTransition({ children, className }: PageTransitionProps) {
  // Default to desktop for SSR, update on client
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile on client side
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Mobile-optimized: Reduced blur and faster transitions
  const variants = {
    initial: {
      opacity: 0,
      y: 30,
      filter: 'blur(8px)',
      scale: 0.96,
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1], // smooth-in-out
        filter: {
          duration: 0.4,
          ease: 'easeOut',
        },
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: -30,
      filter: 'blur(8px)',
      scale: 0.96,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
        filter: {
          duration: 0.3,
          ease: 'easeIn',
        },
      },
    },
  }

  // Mobile-specific variants with reduced effects
  const mobileVariants = {
    initial: {
      opacity: 0,
      y: 15,
      filter: 'blur(4px)',
      scale: 0.98,
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
        filter: {
          duration: 0.25,
          ease: 'easeOut',
        },
        staggerChildren: 0.03,
      },
    },
    exit: {
      opacity: 0,
      y: -15,
      filter: 'blur(4px)',
      scale: 0.98,
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1],
        filter: {
          duration: 0.2,
          ease: 'easeIn',
        },
      },
    },
  }

  return (
    <motion.div
      variants={isMobile ? mobileVariants : variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
      style={{
        willChange: 'transform, opacity, filter', // Performance optimization
        backfaceVisibility: 'hidden', // Prevent flickering
        WebkitBackfaceVisibility: 'hidden',
        transform: 'translateZ(0)', // GPU acceleration
        WebkitTransform: 'translateZ(0)',
      }}
    >
      {children}
    </motion.div>
  )
}

// Export AnimatePresence wrapper for use with Next.js App Router
export function PageTransitionWrapper({ 
  children, 
  key 
}: { 
  children: ReactNode
  key?: string | number
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition key={key}>{children}</PageTransition>
    </AnimatePresence>
  )
}

