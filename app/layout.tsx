import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ecommerce UMKM',
  description: 'Platform ecommerce modern untuk UMKM',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
