import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { FarmProvider } from "@/context/FarmContext";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Harvaan — Intelligent Crop Transition Platform",
  description:
    "AI-powered crop transition guidance for smallholder farmers in India. Get personalized soil analysis, crop recommendations, and connect with enterprise buyers.",
  keywords: "farming, crop transition, soil analysis, India, agriculture, AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-stone-950`}>
        <LanguageProvider>
          <FarmProvider>
            <Navbar />
            <main className="min-h-[calc(100vh-4rem)]">{children}</main>
            <footer className="border-t border-stone-800 py-8 mt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row
                              items-center justify-between gap-4 text-stone-500 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌾</span>
                  <span className="font-semibold text-stone-400">Harvaan</span>
                  <span>— Empowering Farmers with AI</span>
                </div>
                <p>© 2024 Harvaan. Built for a better harvest.</p>
              </div>
            </footer>
          </FarmProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
