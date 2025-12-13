'use client'

import { motion } from 'framer-motion'

export default function Footer() {
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  return (
    <motion.footer
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="relative mt-auto overflow-hidden"
    >
      {/* Glassmorphic background with enhanced effects */}
      <div className="absolute inset-0 backdrop-blur-xl bg-black/30 border-t border-white/10" />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Animated border glow */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Main content with enhanced spacing */}
          <motion.div
            variants={itemVariants}
            className="text-center space-y-4"
          >
            <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed">
              Built by{' '}
              <motion.span
                className="font-semibold text-white inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Bappy Ahmmed
              </motion.span>
            </p>
            
            {/* Email link with enhanced styling */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-2 flex-wrap"
            >
              <motion.a
                href="mailto:itznobita958@gmail.com"
                className="group relative inline-flex items-center gap-2 text-sm sm:text-base text-blue-400 hover:text-blue-300 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated underline */}
                <span className="relative">
                  itznobita958@gmail.com
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                  />
                </span>
                
                {/* Email icon animation */}
                <motion.svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </motion.svg>
              </motion.a>
            </motion.div>

            {/* Decorative divider */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-2 pt-4"
            >
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400/50" />
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </motion.div>

            {/* Copyright/Year */}
            <motion.p
              variants={itemVariants}
              className="text-xs sm:text-sm text-white/50"
            >
              © {new Date().getFullYear()} Dream to Reality Engine. All rights reserved.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  )
}


