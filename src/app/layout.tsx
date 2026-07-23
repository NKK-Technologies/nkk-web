import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import localFont from 'next/font/local'
import { Space_Grotesk } from 'next/font/google'
import { SITE_TITLE, SITE_DESCRIPTION } from '@/lib/site'
import './globals.css'

const avenirNext = localFont({
  src: [
    { path: '../fonts/AvenirNext-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/AvenirNext-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../fonts/AvenirNext-BoldItalic.woff2', weight: '700', style: 'italic' },
    { path: '../fonts/AvenirNext-Heavy.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-avenir-next',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: { icon: '/icon_app.png' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${avenirNext.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  )
}
