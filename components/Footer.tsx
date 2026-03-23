import Link from "next/link";
import { KnectIQLogo, SelectiveTrustMark } from "./KnectIQLogo";

const footerLinks = {
  solutions: [
    { href: "/what-we-do", label: "SelectiveTRUST®" },
    { href: "/what-we-do#how-it-works", label: "How It Works" },
    { href: "/what-we-do#capabilities", label: "Key Capabilities" },
    { href: "/what-we-do#integration", label: "Integration" },
  ],
  company: [
    { href: "/why-knectiq", label: "Why KnectIQ" },
    { href: "/about", label: "About Us" },
    { href: "/insights", label: "Insights" },
    { href: "/contact", label: "Contact" },
  ],
  sectors: [
    { href: "/what-we-do#defense", label: "Defense & Intelligence" },
    { href: "/what-we-do#government", label: "Government" },
    { href: "/what-we-do#enterprise", label: "Enterprise" },
    { href: "/what-we-do#allied-nations", label: "Allied Nations" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-white/5">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <KnectIQLogo size="md" className="mb-4" />
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-6">
              Pioneer in programmable sovereign trust solutions. KnectIQ&apos;s
              patented SelectiveTRUST® technology establishes device-rooted,
              verifiable trust relationships that protect data, networks, and AI
              systems across any domain.
            </p>
            <SelectiveTrustMark className="mb-6" />
            <div className="flex items-center gap-3">
              {/* SOC 2 badge */}
              <div className="trust-badge px-3 py-1.5 rounded-lg text-xs text-slate-300 flex items-center gap-1.5">
                <svg className="w-3 h-3 text-trust-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                SOC 2 Audited
              </div>
              <div className="trust-badge px-3 py-1.5 rounded-lg text-xs text-slate-300 flex items-center gap-1.5">
                <svg className="w-3 h-3 text-sovereign-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                FIPS 140-2 Validated
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Solutions</h4>
            <ul className="space-y-2.5">
              {footerLinks.solutions.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Sectors</h4>
            <ul className="space-y-2.5">
              {footerLinks.sectors.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} KnectIQ Inc. All rights reserved.
            SelectiveTRUST® is a registered trademark of KnectIQ Inc.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">
              Terms of Use
            </Link>
            <span className="text-slate-600 text-xs">Roseville, Minnesota</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
