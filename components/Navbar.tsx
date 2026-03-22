"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { LANGUAGES } from "@/lib/translations";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, setLang, t } = useLang();

  const navLinks = [
    { href: "/", label: t.home },
    { href: "/soil-input", label: t.farmAnalysis },
    { href: "/dashboard", label: t.dashboard },
    { href: "/marketplace", label: t.marketplace },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-stone-950/90 backdrop-blur border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="text-2xl">🌾</span>
            <span className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
              Harvaan
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  pathname === link.href
                    ? "bg-green-900/50 text-green-400 border border-green-800"
                    : "text-stone-400 hover:text-stone-100 hover:bg-stone-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Language selector + CTA */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {/* Language dropdown */}
            <div className="relative">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as typeof lang)}
                className="appearance-none bg-stone-800 border border-stone-700 text-stone-300
                           text-sm rounded-lg pl-3 pr-7 py-1.5 cursor-pointer
                           hover:border-stone-500 focus:outline-none focus:ring-1 focus:ring-green-600
                           transition-colors"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.nativeName}</option>
                ))}
              </select>
              {/* Chevron icon */}
              <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <Link href="/soil-input" className="btn-gold text-sm py-2 px-4">
              {t.analyzeBtn}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-stone-800">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium mb-1 transition-colors ${
                  pathname === link.href
                    ? "bg-green-900/50 text-green-400"
                    : "text-stone-400 hover:text-white hover:bg-stone-800"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile language picker */}
            <div className="mt-3 px-1">
              <p className="text-stone-500 text-xs mb-2 px-3">Language / भाषा</p>
              <div className="flex flex-wrap gap-2 px-3">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                      lang === l.code
                        ? "bg-green-900/50 border-green-700 text-green-300"
                        : "bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500"
                    }`}
                  >
                    {l.nativeName}
                  </button>
                ))}
              </div>
            </div>

            <Link
              href="/soil-input"
              onClick={() => setMenuOpen(false)}
              className="block mt-3 btn-gold text-center text-sm py-2 px-4"
            >
              {t.analyzeBtn}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
