'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import AppShell from './components/AppShell'

export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  
  // Pages that should use full-screen layout (no glass card)
  const fullScreenPages = ['/login']
  const isFullScreen = fullScreenPages.includes(pathname || '')

  return (
    <AppShell fullScreen={isFullScreen}>
      {children}
    </AppShell>
  )
}

