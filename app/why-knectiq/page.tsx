import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why KnectIQ — Sovereign Trust That Cannot Be Compromised",
  description:
    "KnectIQ's SelectiveTRUST® is not another security layer — it's a new foundation. Learn why programmable, sovereign, provable trust changes everything.",
};

const differentiators = [
  {
    them: "Key management infrastructure is a high-value target. Keys must be stored, rotated, and managed — creating persistent attack surfaces.",
    us: "No persistent keys. Ever. Ephemeral keys are born at the device, used once, and destroyed. Nothing to steal, rotate, or compromise.",
    category: "Key Architecture",
    icon: "🔑",
  },
  {
    them: "Zero Trust frameworks verify identity and access — but don't engineer trust into the communication fabric itself.",
    us: "SelectiveTRUST® extends and enhances Zero Trust by establishing cryptographic trust at the device and transaction level, not just the perimeter.",
    category: "Zero Trust",
    icon: "🛡️",
  },
  {
    them: "Cross-domain data sharing requires trusting shared infrastructure, partner networks, or third-party trust brokers.",
    us: "Fine-grain sovereign controls let you collaborate across domains without ever ceding control of your cryptographic keys or trust policies.",
    category: "Sovereignty",
    icon: "🌐",
  },
  {
    them: "Most security systems see, log, or touch data — creating additional exposure surfaces and compliance burdens.",
    us: "SelectiveTRUST® operates on the control plane only. It manages trust relationships. It never sees or touches your data.",
    category: "Data Exposure",
    icon: "👁️",
  },
  {
    them: "Deploying new security architectures typically requires ripping out existing infrastructure — expensive, disruptive, slow.",
    us: "SelectiveTRUST® integrates with your current security stack. No rip and replace. Full capability delivered into your existing environment.",
    category: "Integration",
    icon: "⚡",
  },
  {
    them: "Quantum-era threats require new cryptographic primitives — most deployed systems are not agile enough to adapt.",
    us: "FIPS 203-capable cryptographic agility means your trust infrastructure adapts to quantum threats without architectural replacement.",
    category: "Quantum Readiness",
    icon: "⚛️",
  },
];

const whyPoints = [
  {
    number: "01",
    title: "We Invented Programmable Sovereign Trust",
    body: "SelectiveTRUST® is not built on existing frameworks — it's a fundamentally new architecture for establishing trust. Our patents cover the core technology that makes device-rooted, ephemeral-key trust at scale possible. This is not an incremental improvement to existing security models.",
  },
  {
    number: "02",
    title: "Trust Is Our Only Focus",
    body: "We didn't start as a network security company, a VPN vendor, or a compliance tool that added trust features. KnectIQ was formed specifically to solve the programmable sovereign trust problem. Trust architecture is our entire product, our only product, and our deepest expertise.",
  },
  {
    number: "03",
    title: "Proven in Defense-Grade Environments",
    body: "SelectiveTRUST® has been validated against the most demanding security requirements on the planet — FIPS 140-2, SOC 2, and defense-grade operational environments. If it can protect classified military communications and intelligence platforms, it can protect your most critical data.",
  },
  {
    number: "04",
    title: "Available Now. Integrates Today.",
    body: "SelectiveTRUST® is not a roadmap item. It is available now and designed to integrate with your current security stack without infrastructure replacement. Governments and enterprises can begin establishing programmable sovereign trust today.",
  },
  {
    number: "05",
    title: "Built for the Geoeconomic Reality",
    body: "We recognize that the global operating environment has shifted. Trade, capital, technology, and data are instruments of national advantage. Security sovereignty — not digital sovereignty theater — is achievable and is what we deliver.",
  },
];

const comparisons = [
  { label: "Persistent Key Storage Required", traditional: true, knectiq: false },
  { label: "Key Rotation Management Required", traditional: true, knectiq: false },
  { label: "Ephemeral, Single-Use Keys", traditional: false, knectiq: true },
  { label: "Control-Plane Only (Never Touches Data)", traditional: false, knectiq: true },
  { label: "Device-Level Trust Root", traditional: false, knectiq: true },
  { label: "Quantum-Resistant by Architecture", traditional: false, knectiq: true },
  { label: "Multi-Domain Interoperability", traditional: false, knectiq: true },
  { label: "No Infrastructure Replacement Needed", traditional: false, knectiq: true },
  { label: "FIPS 140-2 Validated", traditional: "varies", knectiq: true },
  { label: "Real-Time Trust Verification", traditional: false, knectiq: true },
  { label: "Fine-Grain Sovereign Controls", traditional: false, knectiq: true },
  { label: "AI & Autonomous System Trust", traditional: false, knectiq: true },
];

export default function WhyKnectIQPage() {
  return (
    <div className="bg-navy-900 pt-20">
      {/* ── HERO ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-trust-600/8 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-block trust-badge px-3 py-1 rounded-full text-xs font-semibold text-trust-300 mb-6">
              WHY KNECTIQ
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              Trust Protection{" "}
              <span className="gradient-text">
                Is Not a Feature.
              </span>
              <span className="block">It&apos;s the Foundation.</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-8">
              Every security product claims to protect you. KnectIQ is different:
              we engineer the trust layer that everything else depends on.
              SelectiveTRUST® is not another tool in your stack — it&apos;s the cryptographic
              foundation beneath it.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHY POINTS ── */}
      <section className="py-24 bg-navy-950 relative">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Five Reasons KnectIQ Is{" "}
              <span className="gradient-text-sovereign">Different</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyPoints.map((point) => (
              <div
                key={point.number}
                className="group bg-navy-800/60 border border-white/8 hover:border-trust-600/30 rounded-2xl p-8 backdrop-blur-sm card-hover"
              >
                <div className="text-4xl font-black gradient-text-trust mb-4 opacity-40">
                  {point.number}
                </div>
                <h3 className="text-white font-bold text-lg mb-4 leading-snug">
                  {point.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{point.body}</p>
              </div>
            ))}

            {/* Final card — CTA */}
            <div className="group bg-gradient-to-br from-trust-600/20 to-sovereign-600/10 border border-trust-600/30 rounded-2xl p-8 backdrop-blur-sm card-hover flex flex-col justify-between">
              <div>
                <div className="text-4xl font-black text-white mb-4 opacity-40">06</div>
                <h3 className="text-white font-bold text-lg mb-4">
                  Ready to Speak With Our Team?
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Our architects can show you exactly how SelectiveTRUST® integrates
                  with your specific environment and addresses your trust challenges.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-trust-600 to-trust-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 shadow-trust text-sm"
              >
                Request a Briefing
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIFFERENTIATORS TABLE ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 hex-pattern" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block trust-badge px-3 py-1 rounded-full text-xs font-semibold text-trust-300 mb-4">
              TECHNICAL DIFFERENTIATORS
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              SelectiveTRUST® vs.{" "}
              <span className="gradient-text">Traditional Approaches</span>
            </h2>
            <p className="text-slate-400 text-lg">
              See how SelectiveTRUST® fundamentally changes the security equation.
            </p>
          </div>

          <div className="bg-navy-800/60 border border-white/8 rounded-2xl overflow-hidden backdrop-blur-sm">
            {/* Header */}
            <div className="grid grid-cols-3 gap-0 border-b border-white/10">
              <div className="p-5 text-sm font-semibold text-slate-400">Capability</div>
              <div className="p-5 text-sm font-semibold text-slate-400 border-l border-white/8 text-center">Traditional Security</div>
              <div className="p-5 text-sm font-semibold text-trust-400 border-l border-white/8 text-center">SelectiveTRUST®</div>
            </div>

            {/* Rows */}
            {comparisons.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-3 gap-0 border-b border-white/5 last:border-0 ${
                  i % 2 === 0 ? "bg-white/1" : ""
                }`}
              >
                <div className="p-4 text-slate-300 text-sm flex items-center">{row.label}</div>

                <div className="p-4 border-l border-white/8 flex items-center justify-center">
                  {row.traditional === true ? (
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : row.traditional === false ? (
                    <svg className="w-5 h-5 text-red-500/70" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-slate-500 text-xs">Varies</span>
                  )}
                </div>

                <div className="p-4 border-l border-trust-600/20 flex items-center justify-center bg-trust-600/3">
                  {row.knectiq === true ? (
                    <svg className="w-5 h-5 text-trust-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-500/70" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VS SECTION ── */}
      <section className="py-24 bg-navy-950 relative">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Where SelectiveTRUST® is{" "}
              <span className="gradient-text">Fundamentally Different</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {differentiators.map((d) => (
              <div
                key={d.category}
                className="bg-navy-800/60 border border-white/8 rounded-2xl overflow-hidden backdrop-blur-sm card-hover"
              >
                <div className="bg-gradient-to-r from-navy-700/50 to-navy-800/50 px-6 py-4 border-b border-white/8 flex items-center gap-3">
                  <span className="text-2xl">{d.icon}</span>
                  <span className="text-white font-bold text-sm">{d.category}</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                      <span className="text-red-400 text-xs font-bold">✕</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{d.them}</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-trust-600/20 border border-trust-600/30 flex items-center justify-center">
                      <span className="text-trust-400 text-xs font-bold">✓</span>
                    </div>
                    <p className="text-white text-sm leading-relaxed font-medium">{d.us}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERS BAND ── */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-slate-500 text-sm mb-8 uppercase tracking-wider">Trusted by leaders in defense and intelligence</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {["SRC UK", "AFCEA", "DoD Partners", "Allied Nations"].map((partner) => (
              <div
                key={partner}
                className="trust-badge px-6 py-2.5 rounded-xl text-slate-400 text-sm font-medium"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-trust-600/10 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-5">
            The case for SelectiveTRUST® is clear.
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Let our architects walk you through a technical deep-dive tailored to your environment,
            your classification requirements, and your mission context.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-trust-600 to-trust-700 hover:from-trust-500 hover:to-trust-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-trust"
            >
              Request a Technical Briefing
            </Link>
            <Link
              href="/what-we-do"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200"
            >
              Explore SelectiveTRUST®
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
