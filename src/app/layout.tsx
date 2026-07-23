import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SITE_TITLE, SITE_DESCRIPTION } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: { icon: '/icon_app.png' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
