import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import LayoutWrapper from './components/LayoutWrapper'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Dream to Reality Engine',
  description: 'Transform your dreams into videography with our powerful AI engine',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <LayoutWrapper>
          <Header />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
            {children}
          </main>
          <Footer />
        </LayoutWrapper>
      </body>
    </html>
  )
}


