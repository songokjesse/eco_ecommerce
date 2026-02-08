import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { CookieConsent } from "@/components/privacy/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CircuCity - Your Destination for Sustainable Living",
  description: "Join the eco-friendly revolution. Shop organic, recycled, and sustainable products at CircuCity. Reduce your carbon footprint today.",
  keywords: ["sustainable", "eco-friendly", "organic", "recycled", "marketplace", "green living"],
  openGraph: {
    title: "CircuCity - Sustainable Living Marketplace",
    description: "Shop conscious. Live sustainable. Discover eco-friendly products that make a difference.",
    type: "website",
    locale: "en_US",
    siteName: "CircuCity",
  }
};

import { ClerkProvider } from "@clerk/nextjs";

// ... existing imports

import { ClientLayout } from "@/components/layout/ClientLayout";
import { LanguageProvider } from "@/components/context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
        >
          <LanguageProvider>
            <ClientLayout>{children}</ClientLayout>
          </LanguageProvider>
          <CookieConsent />
        </body>
      </html>
    </ClerkProvider>
  );
}
