'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function FeedPage() {
  const feedItems = [
    { id: 1, title: 'Sample Post 1', excerpt: 'This is a sample post excerpt...' },
    { id: 2, title: 'Sample Post 2', excerpt: 'This is another sample post excerpt...' },
    { id: 3, title: 'Sample Post 3', excerpt: 'Yet another sample post excerpt...' },
  ]

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

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-8 text-white"
      >
        Feed
      </motion.h1>

      <div className="space-y-6">
        {feedItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="glass p-6 rounded-xl shadow-medium hover:shadow-large transition-all"
          >
            <Link href={`/dream/${item.id}`}>
              <h2 className="text-2xl font-semibold mb-2 text-white hover:text-purple-300 transition-colors">
                {item.title}
              </h2>
              <p className="text-white/70">{item.excerpt}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </>
  )
}


