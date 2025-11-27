import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

// sokuresu.com用の完璧なメタデータ・SEO設定
export const metadata: Metadata = {
  title: "sokuresu.com - 即レス AI相談 | 質問に素早く回答するAIチャット",
  description: "あなたの質問や相談にドストレートに即レスするAIサービス。24時間利用可能で、様々なテーマについて即座にアドバイスを受けられます。",
  keywords: ["AI相談", "チャットボット", "AIサービス", "質問応答", "即座対応"],
  authors: [{ name: "sokuresu.com" }],
  creator: "sokuresu.com",
  publisher: "sokuresu.com",
  generator: "v0.app",
  applicationName: "sokuresu",
  referrer: "origin-when-cross-origin",
  category: "Technology",
  classification: "Technology",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  icons: {
    icon: [
      {
        url: "/icon.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: "/icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "sokuresu",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://sokuresu.com",
    siteName: "sokuresu",
    title: "sokuresu.com - 即レス AI相談",
    description: "あなたの質問や相談にドストレートに即レスするAIサービス",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "sokuresu - AI相談サービス",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "sokuresu.com - 即レス AI相談",
    description: "あなたの質問や相談にドストレートに即レスするAIサービス",
    images: ["/og-image.png"],
  },
  verification: {
    google: "google-site-verification-code",
  },
}

export const viewport: Viewport = {
  themeColor: "#1a1a2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a1a2e" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* JSON-LD 構造化データ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "sokuresu",
              url: "https://sokuresu.com",
              description: "あなたの質問や相談にドストレートに即レスするAIサービス",
              applicationCategory: "Productivity",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "JPY",
              },
            }),
          }}
        />
        {/* Organization スキーマ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "sokuresu",
              url: "https://sokuresu.com",
              logo: "https://sokuresu.com/icon.png",
              description: "即レスAIチャットサービス",
            }),
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
