import React from "react";
import type { Metadata } from "next";
import { Inter, Roboto, Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ClerkProvider } from "@clerk/nextjs";
import { LanguageProvider } from "@/lib/LanguageContext";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], display: "swap" });
const roboto = Roboto({ subsets: ["latin", "cyrillic"], display: "swap", weight: ["400", "500", "700"] });
const montserrat = Montserrat({ subsets: ["latin", "cyrillic"], display: "swap" });

export const metadata: Metadata = {
  title: "GoFundMe - #1 Crowdfunding Platform",
  description:
    "Start a fundraiser, donate to causes you care about, and make a difference in the world.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <body className={`antialiased min-h-screen`} style={{
        fontFamily: inter.style.fontFamily,
      }}>
        {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && (
          <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            <LanguageProvider>
              {children}
              <Analytics />
            </LanguageProvider>
          </ClerkProvider>
        )}
        <Toaster 
          position="top-center"
          toastOptions={{
            classNames: {
              toast: 'bg-white border border-gray-200 shadow-lg',
              title: 'text-lg font-semibold',
              description: 'text-sm text-gray-600',
            },
            style: {
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
          }}
        />
      </body>
    </html>
  );
}
