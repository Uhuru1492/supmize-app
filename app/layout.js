import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Supmize - AI Supplement Safety Checker',
  description: 'Avoid dangerous supplement interactions. AI-powered analysis catches interactions doctors miss. Scan before you buy and save money on unsafe products.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-575D3DF1HT"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-575D3DF1HT');
          `}
        </Script>
        {children}
      </body>
    </html>
  )
}
