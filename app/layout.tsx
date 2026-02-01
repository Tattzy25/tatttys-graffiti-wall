import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Street Canvas - Graffiti Spray Paint",
  description:
    "Create stunning street art on a realistic brick wall canvas with authentic spray paint dynamics",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/graffiti-art-1769952660084.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/graffiti-art-1769952660084.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/graffiti-art-1769952660084.png",
        type: "image/png",
      },
    ],
    apple: "/graffiti-art-1769952660084.png",
  },
  // Allow embedding in iframes
  robots: {
    index: true,
    follow: true,
  },
  // Open Graph metadata for social sharing
  openGraph: {
    title: "Street Canvas - Graffiti Spray Paint",
    description:
      "Create stunning street art on a realistic brick wall canvas with authentic spray paint dynamics",
    url: "https://graffiti-spray-experience.vercel.app",
    type: "website",
    images: [
      {
        url: "/graffiti-art-1769952660084.png",
        width: 1200,
        height: 630,
        alt: "Street Canvas Graffiti Art",
      },
    ],
  },
  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Street Canvas - Graffiti Spray Paint",
    description:
      "Create stunning street art on a realistic brick wall canvas with authentic spray paint dynamics",
    images: ["/graffiti-art-1769952660084.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
