import { AnalyticsWrapper } from './components/Analytics'
import { Footer } from './components/Footer'
import { Nav } from './components/Nav'
import { createMetadata } from '../utils/createMetadata'

import { Overpass, Open_Sans } from 'next/font/google'
import Script from 'next/script'

import '../styles/globals.css'

const overpass = Overpass({
  subsets: ['latin'],
  variable: '--font-overpass',
  // display: 'swap',
})

const open_sans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  // display: 'swap',
})

export const metadata = createMetadata({
  description: 'Creating transparent and responsible scholarship.',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${open_sans.variable} ${overpass.variable}`}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#002642" />
        <meta name="msapplication-TileColor" content="#002642" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
        <AnalyticsWrapper />
        <Script
          strategy="afterInteractive"
          data-domain="trialanderror.org"
          src="/stats/js/script"
          data-api="/stats/api/event"
        />
      </body>
    </html>
  )
}
