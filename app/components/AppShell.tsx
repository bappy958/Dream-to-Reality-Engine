'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AppShellProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full'
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullScreen?: boolean
  variant?: 'default' | 'elevated' | 'minimal'
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
}

const paddingClasses = {
  none: '',
  xs: 'p-3 sm:p-4 md:p-5',
  sm: 'p-4 sm:p-5 md:p-6 lg:p-7',
  md: 'p-5 sm:p-6 md:p-8 lg:p-10',
  lg: 'p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14',
  xl: 'p-8 sm:p-10 md:p-12 lg:p-16 xl:p-20',
}

const variantClasses = {
  default: 'glass-strong',
  elevated: 'glass-strong shadow-soft-neon',
  minimal: 'glass',
}

export default function AppShell({
  children,
  className,
  maxWidth = 'full',
  padding = 'md',
  fullScreen = false,
  variant = 'default',
}: AppShellProps) {
  // Enhanced floating animation with subtle rotation
  const floatingAnimation = {
    animate: {
      y: [0, -10, 0],
      rotate: [0, 0.5, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: [0.4, 0, 0.6, 1], // smooth-in-out
      },
    },
  }

  // Enhanced page entrance animation
  const containerVariants = {
    initial: {
      opacity: 0,
      y: 30,
      scale: 0.96,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1], // smooth-in-out
        staggerChildren: 0.08,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  // If fullScreen, render without glass card wrapper
  if (fullScreen) {
    return (
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={cn('w-full min-h-[calc(100vh-8rem)]', className)}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(
        'w-full',
        maxWidthClasses[maxWidth],
        'mx-auto',
        'my-4 sm:my-6 md:my-8 lg:my-10'
      )}
    >
      <motion.div
        variants={floatingAnimation}
        animate="animate"
        whileHover={{
          scale: 1.01,
          transition: { duration: 0.3 },
        }}
        className={cn(
          variantClasses[variant],
          'rounded-2xl sm:rounded-3xl',
          'shadow-large shadow-neon-purple',
          'backdrop-blur-xl',
          'border border-white/10',
          paddingClasses[padding],
          'relative overflow-hidden',
          'transition-all duration-smooth',
          className
        )}
      >
        {/* Enhanced multi-layer glow effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-500/5 to-transparent pointer-events-none" />
        
        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none"
          animate={{
            boxShadow: [
              '0 0 0px rgba(168, 85, 247, 0)',
              '0 0 20px rgba(168, 85, 247, 0.1)',
              '0 0 0px rgba(168, 85, 247, 0)',
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Content wrapper with proper spacing */}
        <div className="relative z-10 h-full">
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}

