'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ProfilePage() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link
          href="/"
          className="text-white/70 hover:text-white transition-colors mb-6 inline-block"
        >
          ← Back to Home
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-24 h-24 gradient-neon-blue rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-neon-blue"
          >
            U
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">
            User Profile
          </h1>
          <p className="text-white/70">Welcome to your profile</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Name
            </label>
            <div className="px-4 py-3 glass rounded-xl text-white">
              John Doe
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Email
            </label>
            <div className="px-4 py-3 glass rounded-xl text-white">
              user@example.com
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Bio
            </label>
            <div className="px-4 py-3 glass rounded-xl text-white min-h-[100px]">
              This is a placeholder bio. Update it to tell others about yourself.
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 gradient-neon-blue text-white py-3 rounded-xl font-semibold shadow-neon-blue hover:shadow-soft-neon transition-all"
        >
          Edit Profile
        </motion.button>
      </motion.div>
    </>
  )
}


