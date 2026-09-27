import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AirBnMe · Seaside apartment in Vouliagmeni',
  description: "Book a visit to Dylan's apartment on the Athens Riviera",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-[#222] antialiased">{children}</body>
    </html>
  )
}
