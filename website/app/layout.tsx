import type { Metadata, Viewport } from 'next'
import { Nunito, Quicksand } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SolanaProvider } from '@/components/solana-provider'
import { UserProvider } from '@/components/user-provider'
import { Toaster } from 'sonner'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
})

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
})

export const metadata: Metadata = {
  title: 'BerryStylish - NFT Dress Up Game & Social Network',
  description:
    'Create your dream avatar, collect exclusive NFT outfits, and connect with a vibrant community of fashion lovers. The cutest dress-up game meets social networking.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#e8a0b4',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${quicksand.variable} font-sans antialiased`}
      >
        <SolanaProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </SolanaProvider>
        <Toaster position="bottom-right" />
        <Analytics />
      </body>
    </html>
  )
}
