// /app/layout.tsx
import Script from "next/script";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./ui/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "海龜湯推理解謎平台",
  description: "一個可直接公開遊玩的海龜湯推理網站，提供玩法教學、挑戰入口、排行榜及公開資訊頁。",
  verification: {
    google: "l4jW3ViZI7ZQlkP5K4YAtFVIMbZ3fsVayoQGN7vcM_I",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          id="adsense-loader"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2071278885677120"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <NavBar />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}