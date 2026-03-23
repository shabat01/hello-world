import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KnectIQ | Programmable Sovereign Trust Architecture",
  description:
    "KnectIQ pioneers programmable sovereign trust with SelectiveTRUST® — verifiable, device-rooted trust relationships protecting data, networks, and AI across any domain.",
};

const stats = [
  { value: "100%", label: "Ephemeral Keys", sub: "Single-use, never stored" },
  { value: "Zero", label: "Persistent Key Risk", sub: "Generated, used, destroyed" },
  { value: "FIPS", label: "140-2 Validated", sub: "FIPS 203-capable" },
  { value: "Real-time", label: "Trust Verification", sub: "Every device, every transaction" },
];

const capabilities = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Sovereign Trust Control",
    description:
      "Preserve national and enterprise digital sovereignty with fine-grain controls that keep you in command — even during cross-domain collaboration.",
    accent: "from-trust-600 to-trust-700",
    glow: "group-hover:shadow-trust",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Programmable Trust Fabric",
    description:
      "Engineer trust policies at the architecture level. Define, enforce, and adapt trust rules dynamically across devices, users, and mission environments.",
    accent: "from-sovereign-600 to-sovereign-700",
    glow: "group-hover:shadow-sovereign",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Ephemeral Key Cryptography",
    description:
      "Single-use encryption keys generated on-device at the moment of need, used once, then destroyed. No persistent keys to steal, rotate, or manage.",
    accent: "from-trust-500 to-sovereign-600",
    glow: "group-hover:shadow-trust",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    title: "Multi-Domain Interoperability",
    description:
      "Secure trusted collaboration across classification levels, networks, and allied partners — without sacrificing sovereignty or operational security.",
    accent: "from-blue-600 to-trust-600",
    glow: "group-hover:shadow-trust",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Quantum-Ready Architecture",
    description:
      "FIPS 203-capable cryptographic agility ensures your trust infrastructure remains secure against current and emerging quantum threats.",
    accent: "from-sovereign-500 to-trust-600",
    glow: "group-hover:shadow-sovereign",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
    title: "Control-Plane Architecture",
    description:
      "The trust system operates on the control plane — it never sees or touches your data. Integrate with your existing stack without rip-and-replace.",
    accent: "from-trust-700 to-sovereign-700",
    glow: "group-hover:shadow-trust",
  },
];

const trustPillars = [
  {
    label: "Institutional",
    description: "Regulators verify controls in real time. Compliance is demonstrable, not assumed.",
    icon: "🏛️",
  },
  {
    label: "Operational",
    description: "Leaders rely on telemetry and access governance even under disruption.",
    icon: "⚔️",
  },
  {
    label: "Market",
    description: "Partners measure compliance and data integrity at the moment of exchange.",
    icon: "🤝",
  },
  {
    label: "Digital",
    description: "Identity, device posture, data access, and policy enforcement — continuously verified.",
    icon: "🔐",
  },
];

const sectors = [
  {
    title: "Defense & Intelligence",
    description:
      "Accelerate Zero Trust transformation for warfighters. Deliver data operationalization at the speed of tactical relevance across all classification levels.",
    tags: ["Multi-Domain Operations", "Coalition Networks", "Edge Security"],
    gradient: "from-navy-800 to-navy-700",
    border: "border-trust-600/30",
    hover: "hover:border-trust-500/60",
  },
  {
    title: "Government",
    description:
      "Achieve true security sovereignty. Control the cryptographic keys, trust policies, and access governance that determine whether your systems are actually secure.",
    tags: ["Federal Networks", "Cross-Agency Sharing", "National Security"],
    gradient: "from-navy-800 to-navy-700",
    border: "border-sovereign-600/30",
    hover: "hover:border-sovereign-500/60",
  },
  {
    title: "Enterprise",
    description:
      "Protect your data, networks, and AI systems without complexity. SelectiveTRUST® integrates with your current security stack and speeds digital transformation.",
    tags: ["Critical Infrastructure", "Partner Ecosystems", "AI Security"],
    gradient: "from-navy-800 to-navy-700",
    border: "border-blue-600/30",
    hover: "hover:border-blue-500/60",
  },
];

const insights = [
  {
    category: "Thought Leadership",
    title: "The Provable Trust Era: Sovereignty, National Security, and Resilient Global Collaboration",
    excerpt:
      "Without programmable, sovereign, provable, engineered trust — collaboration becomes exposure. Here's what it means to operate in the provable trust era.",
    href: "/insights/provable-trust-era",
    date: "2025",
  },
  {
    category: "Analysis",
    title: "The Sovereignty Illusion: Why Spending Billions on AI Infrastructure Buys You Neither Sovereignty Nor Security",
    excerpt:
      "Full digital sovereignty is expensive and largely unattainable. But security sovereignty — control over the things that determine if your systems are actually secure — is achievable.",
    href: "/insights/sovereignty-illusion",
    date: "2025",
  },
  {
    category: "News",
    title: "KnectIQ and SRC UK Forge Licensing Agreement to Power Next-Generation Intelligence and Defense Platforms",
    excerpt:
      "SelectiveTRUST® technology will be integrated into select commercial and defense intelligence platforms serving the UK, USA, Europe, Australia, and allied nations.",
    href: "/insights/src-uk-licensing",
    date: "2025",
  },
];

export default function HomePage() {
  return (
    <div className="bg-navy-900">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-grid opacity-100" />
        <div className="absolute inset-0 bg-hero-gradient" />
        {/* Radial glow spots */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-trust-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sovereign-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-trust-600/5 rounded-full blur-3xl" />

        {/* Scan line effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-trust-500/20 to-transparent"
            style={{ animation: "scanLine 8s linear infinite" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 trust-badge px-4 py-2 rounded-full mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-sovereign-400 animate-pulse" />
              <span className="text-sm text-slate-300 font-medium">
                SelectiveTRUST® — Patented Sovereign Trust Technology
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] mb-6 animate-slide-up">
              Trust Must Be{" "}
              <span className="block gradient-text">
                Engineered.
              </span>
              <span className="block text-4xl md:text-5xl lg:text-6xl font-bold text-slate-300 mt-2">
                Not Assumed.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed mb-10 max-w-2xl">
              KnectIQ delivers{" "}
              <span className="text-white font-semibold">programmable sovereign trust architectures</span>{" "}
              that protect data, networks, and AI systems — across any domain, at any classification level, in real time.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-16">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-trust-600 to-trust-700 hover:from-trust-500 hover:to-trust-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-trust hover:shadow-trust-lg text-lg group"
              >
                Request a Briefing
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/what-we-do"
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-lg"
              >
                Explore SelectiveTRUST®
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6">
              {[
                "SOC 2 Audited",
                "FIPS 140-2 Validated",
                "FIPS 203-Capable",
                "Minority-Led Company",
              ].map((badge) => (
                <div key={badge} className="flex items-center gap-2 text-sm text-slate-400">
                  <svg className="w-4 h-4 text-sovereign-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-900 to-transparent" />
      </section>

      {/* ── STATS BAND ── */}
      <section className="relative bg-navy-950 border-y border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black gradient-text-trust mb-1">{stat.value}</div>
                <div className="text-white font-semibold text-sm">{stat.label}</div>
                <div className="text-slate-500 text-xs mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM / MISSION ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-30" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left: visual */}
            <div className="relative">
              <div className="relative rounded-2xl border border-trust-600/20 bg-navy-800/50 p-8 backdrop-blur-sm overflow-hidden">
                {/* Trust architecture diagram */}
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Device Identity", status: "verified", color: "text-green-400 bg-green-400/10 border-green-400/20" },
                    { label: "Ephemeral Key Generated", status: "active", color: "text-sovereign-400 bg-sovereign-400/10 border-sovereign-400/20" },
                    { label: "Trust Relationship Established", status: "active", color: "text-trust-400 bg-trust-400/10 border-trust-400/20" },
                    { label: "Data In Motion — Secured", status: "active", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
                    { label: "Key Destroyed After Use", status: "complete", color: "text-mark-400 bg-mark-400/10 border-mark-400/20" },
                    { label: "Sovereignty Preserved", status: "verified", color: "text-green-400 bg-green-400/10 border-green-400/20" },
                  ].map((item, i) => (
                    <div
                      key={item.label}
                      className={`flex items-center justify-between p-3 rounded-lg border ${item.color} backdrop-blur-sm`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        <span className="text-sm font-mono font-medium">{item.label}</span>
                      </div>
                      <span className="text-xs uppercase tracking-wider opacity-70 font-semibold">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Corner decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-trust-600/5 rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-sovereign-500/5 rounded-tr-full" />
              </div>

              {/* Floating label */}
              <div className="absolute -bottom-4 -right-4 trust-badge px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-card">
                SelectiveTRUST® in action
              </div>
            </div>

            {/* Right: copy */}
            <div>
              <div className="inline-block trust-badge px-3 py-1 rounded-full text-xs font-semibold text-trust-300 mb-4">
                THE TRUST PROBLEM
              </div>
              <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                In a connected world,{" "}
                <span className="gradient-text-sovereign">collaboration without trust</span>{" "}
                is exposure.
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                Perimeter-based security failed. Zero Trust principles are necessary but insufficient.
                The real gap is{" "}
                <span className="text-white font-semibold">
                  engineered, programmable, provable trust
                </span>{" "}
                — trust that is verifiable at the device level, across every transaction, in real time.
              </p>
              <p className="text-slate-400 leading-relaxed mb-8">
                KnectIQ was formed to fill that gap. Our patented SelectiveTRUST® architecture
                doesn&apos;t just extend Zero Trust — it establishes a sovereign trust fabric that
                operates underneath your data, enabling interoperability without sacrificing control.
              </p>
              <Link
                href="/why-knectiq"
                className="inline-flex items-center gap-2 text-trust-400 hover:text-trust-300 font-semibold transition-colors group"
              >
                Why KnectIQ is different
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section className="py-24 bg-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block trust-badge px-3 py-1 rounded-full text-xs font-semibold text-trust-300 mb-4">
              SELECTIVETRUST® CAPABILITIES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
              The Architecture of{" "}
              <span className="gradient-text">Absolute Trust</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              SelectiveTRUST® operates on the control plane — it never touches your data.
              It engineers the trust layer that makes every communication provably secure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap) => (
              <div
                key={cap.title}
                className="group relative bg-navy-800/60 border border-white/8 hover:border-trust-600/40 rounded-2xl p-6 backdrop-blur-sm card-hover cursor-default"
              >
                {/* Icon */}
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${cap.accent} mb-4 text-white shadow-card`}
                >
                  {cap.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{cap.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{cap.description}</p>

                {/* Corner glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-trust-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/what-we-do"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200"
            >
              Explore the Full Architecture
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST PILLARS ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 hex-pattern" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-sovereign-500/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block trust-badge px-3 py-1 rounded-full text-xs font-semibold text-trust-300 mb-4">
                THE FOUR PLANES OF TRUST
              </div>
              <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                Trust must be engineered{" "}
                <span className="gradient-text-sovereign">across every plane</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                KnectIQ recognizes that trust is not a single-layer problem.
                It operates across institutional, operational, market, and digital dimensions —
                and must be provably established in all four simultaneously.
              </p>
              <Link
                href="/why-knectiq"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-trust-600 to-trust-700 hover:from-trust-500 hover:to-trust-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-trust"
              >
                Why This Matters
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {trustPillars.map((pillar) => (
                <div
                  key={pillar.label}
                  className="bg-navy-800/60 border border-white/8 hover:border-trust-600/30 rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 card-hover"
                >
                  <div className="text-3xl mb-3">{pillar.icon}</div>
                  <h3 className="text-white font-bold mb-2">{pillar.label} Trust</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTORS ── */}
      <section className="py-24 bg-navy-950 relative">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block trust-badge px-3 py-1 rounded-full text-xs font-semibold text-trust-300 mb-4">
              SECTORS WE SERVE
            </div>
            <h2 className="text-4xl font-bold text-white mb-5">
              Sovereign Trust for{" "}
              <span className="gradient-text">Every Mission</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              From classified defense networks to regulated enterprise environments,
              SelectiveTRUST® delivers provable trust at the speed your mission demands.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {sectors.map((sector) => (
              <div
                key={sector.title}
                className={`group bg-navy-800/60 border ${sector.border} ${sector.hover} rounded-2xl p-8 backdrop-blur-sm transition-all duration-300 card-hover`}
              >
                <h3 className="text-white font-bold text-xl mb-4">{sector.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {sector.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {sector.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSIGHTS ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-trust-600/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="inline-block trust-badge px-3 py-1 rounded-full text-xs font-semibold text-trust-300 mb-4">
                INSIGHTS
              </div>
              <h2 className="text-4xl font-bold text-white">
                Thinking About <span className="gradient-text-trust">Trust</span>
              </h2>
            </div>
            <Link
              href="/insights"
              className="hidden md:inline-flex items-center gap-2 text-trust-400 hover:text-trust-300 font-semibold text-sm transition-colors"
            >
              All Insights
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {insights.map((post) => (
              <Link
                key={post.title}
                href={post.href}
                className="group bg-navy-800/60 border border-white/8 hover:border-trust-600/30 rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 card-hover flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-trust-400 uppercase tracking-wider">
                    {post.category}
                  </span>
                  <span className="text-xs text-slate-500">{post.date}</span>
                </div>
                <h3 className="text-white font-bold text-base leading-snug mb-3 group-hover:text-trust-300 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-1">{post.excerpt}</p>
                <div className="mt-4 flex items-center gap-1 text-trust-400 text-sm font-medium">
                  Read more
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-trust-600/20 via-sovereign-500/15 to-trust-600/20" />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-trust-600/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-block trust-badge px-3 py-1 rounded-full text-xs font-semibold text-sovereign-300 mb-6">
            AVAILABLE NOW — NO RIP AND REPLACE
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Ready to engineer{" "}
            <span className="gradient-text">provable trust</span>{" "}
            into your architecture?
          </h2>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed">
            SelectiveTRUST® integrates with your current security stack today.
            No infrastructure replacement required. Full sovereignty retained.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-trust-600 to-trust-700 hover:from-trust-500 hover:to-trust-600 text-white font-bold px-10 py-4 rounded-xl transition-all duration-200 shadow-trust hover:shadow-trust-lg text-lg"
            >
              Request a Briefing
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/what-we-do"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-lg backdrop-blur-sm"
            >
              Explore the Solution
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
