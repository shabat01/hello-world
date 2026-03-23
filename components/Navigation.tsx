"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { KnectIQLogo } from "./KnectIQLogo";

const navLinks = [
  { href: "/what-we-do", label: "SelectiveTRUST®" },
  { href: "/why-knectiq", label: "Why KnectIQ" },
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-navy-900/95 backdrop-blur-xl border-b border-trust-600/20 shadow-lg shadow-navy-950/50"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <KnectIQLogo size="sm" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    active
                      ? "text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {active && (
                    <span className="absolute inset-0 rounded-lg bg-trust-600/15 border border-trust-600/25" />
                  )}
                  <span className="relative">{link.label}</span>
                  {!active && (
                    <span className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/5 transition-colors duration-200" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-trust-600 to-trust-700 hover:from-trust-500 hover:to-trust-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 shadow-trust hover:shadow-trust-lg glow-blue group"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Request Briefing
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 pt-4">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-trust-600/20 text-white border border-trust-600/30"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/contact"
                className="mt-2 px-4 py-3 rounded-lg text-sm font-semibold bg-gradient-to-r from-trust-600 to-trust-700 text-white text-center"
              >
                Request Briefing
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
