'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/feed', label: 'Feed' },
  { href: '/compose', label: 'Compose' },
  { href: '/profile', label: 'Profile' },
]

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const containerVariants = {
    initial: { opacity: 0, y: -20 },
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

  const navItemVariants = {
    initial: { opacity: 0, x: -10 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  const mobileMenuVariants = {
    initial: { opacity: 0, height: 0 },
    animate: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  return (
    <motion.header
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="sticky top-0 z-50 relative overflow-hidden"
    >
      {/* Enhanced glassmorphic background */}
      <div className="absolute inset-0 backdrop-blur-xl bg-black/30 border-b border-white/10" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Animated border glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gradient-neon">
                Dream to Reality Engine
              </h1>
              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.5), rgba(59, 130, 246, 0.5))',
                }}
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href
              return (
                <motion.div
                  key={link.href}
                  variants={navItemVariants}
                  custom={index}
                >
                  <Link
                    href={link.href}
                    className="relative group px-3 lg:px-4 py-2 rounded-lg transition-all duration-300"
                  >
                    <span
                      className={`relative z-10 text-sm lg:text-base font-medium transition-colors ${
                        isActive
                          ? 'text-white'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      {link.label}
                    </span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 glass rounded-lg"
                        layoutId="activeNav"
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    
                    {/* Hover background */}
                    {!isActive && (
                      <motion.div
                        className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg glass text-white/70 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
          >
            <motion.svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={isMobileMenuOpen ? { rotate: 90 } : { rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </motion.svg>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              variants={mobileMenuVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2 border-t border-white/10 mt-2">
                {navLinks.map((link, index) => {
                  const isActive = pathname === link.href
                  return (
                    <motion.div
                      key={link.href}
                      variants={navItemVariants}
                      custom={index}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
                          isActive
                            ? 'glass text-white'
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

