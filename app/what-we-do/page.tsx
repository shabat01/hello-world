import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SelectiveTRUST® — Programmable Sovereign Trust Solution",
  description:
    "SelectiveTRUST® by KnectIQ establishes device-rooted, verifiable trust relationships with ephemeral key cryptography, enabling multi-domain interoperability without sacrificing sovereignty.",
};

const howItWorks = [
  {
    step: "01",
    title: "Device Identity Established",
    description:
      "SelectiveTRUST® authenticates and authorizes every trusted device individually — not just users. Device identity is cryptographically verified at the hardware level, establishing the root of trust.",
    detail: "No device enters the trust fabric without cryptographic verification.",
  },
  {
    step: "02",
    title: "Ephemeral Key Generated On-Device",
    description:
      "At the moment of need, a single-use encryption key is dynamically generated at the device. This key is never transmitted, never stored centrally, and has no persistence.",
    detail: "Keys are born at the device, live for one transaction, and die.",
  },
  {
    step: "03",
    title: "Trust Relationship Negotiated",
    description:
      "The control plane manages trust relationships between select, trusted endpoint devices with real-time validation. Trust policies are applied based on device posture, identity, and mission context.",
    detail: "Trust is programmable — policies adapt to context dynamically.",
  },
  {
    step: "04",
    title: "Secure Communication Executed",
    description:
      "Data flows between trusted endpoints, encrypted by the ephemeral key. The SelectiveTRUST® system never sees or touches the data — it operates on the control plane only.",
    detail: "The trust fabric never becomes a data exposure surface.",
  },
  {
    step: "05",
    title: "Key Destroyed. Trust Preserved.",
    description:
      "After each transaction, the ephemeral key is destroyed. There are no persistent keys to steal, rotate, audit, or manage. Sovereignty is maintained for every party in the exchange.",
    detail: "Zero persistent key risk. Absolute forward secrecy.",
  },
];

const capabilities = [
  {
    title: "Quantum-Ready Cryptographic Agility",
    description:
      "FIPS 140-2 validated with a mode of operation that exceeds FIPS 140-2 key security requirements. FIPS 203-capable to defend against quantum-era threats.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "Zero Persistent Key Infrastructure",
    description:
      "No key management server to compromise. No key rotation schedules. No persistent key stores. Eliminate the most targeted attack surface in modern cryptographic deployments.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
  },
  {
    title: "Real-Time Trust Verification",
    description:
      "Every device. Every transaction. Every communication. Trust is verified in real time without increasing operational complexity or cost.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Fine-Grain Sovereign Controls",
    description:
      "Preserve national or enterprise digital sovereignty with granular access controls. Define who can collaborate, with whom, under what conditions — and revoke instantly.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
  {
    title: "Multi-Domain Interoperability",
    description:
      "Secure trusted collaboration across classification levels, networks, partners, and allied nations — without new infrastructure and without sacrificing control.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
  {
    title: "Credential Misuse Prevention",
    description:
      "Eliminate credential reuse attacks. Because keys are ephemeral and device-bound, stolen credentials cannot be replayed or leveraged from another device.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
  },
  {
    title: "Control-Plane Architecture",
    description:
      "SelectiveTRUST® operates on the control plane. It never sees, touches, or stores your data — eliminating any trust system data exposure risk.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
  },
  {
    title: "AI & Autonomous Systems Security",
    description:
      "Extend sovereign trust to AI and machine-to-machine interactions. Secure autonomous systems with the same provable trust guarantees as human-initiated communications.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const useCases = [
  {
    id: "defense",
    title: "Defense & Intelligence",
    headline: "Trust at the Tactical Edge",
    body:
      "SelectiveTRUST® accelerates Zero Trust transformation for warfighters. Deliver data operationalization at the speed of tactical relevance across all classification levels — from the Pentagon to the forward operating base. Secure coalition networks without exposing national intelligence to partner vulnerabilities.",
    outcomes: [
      "Multi-domain operations with fine-grain access control",
      "Secure communications across classification levels",
      "Coalition interoperability without sovereignty compromise",
      "Cyber warfare capability advancement",
    ],
    accent: "border-trust-600/40",
    tagColor: "text-trust-400",
  },
  {
    id: "government",
    title: "Government",
    headline: "Security Sovereignty, Not the Illusion of It",
    body:
      "Full digital sovereignty is expensive and largely unattainable for most nations. But security sovereignty — where you control the cryptographic keys, trust policies, and access governance — is achievable today. SelectiveTRUST® gives governments the tools to verify controls in real time without trusting vendors.",
    outcomes: [
      "Cryptographic control independent of vendor trust",
      "Real-time regulatory and compliance verification",
      "Cross-agency data sharing with preserved sovereignty",
      "Allied-nation collaboration without security compromise",
    ],
    accent: "border-sovereign-600/40",
    tagColor: "text-sovereign-400",
  },
  {
    id: "enterprise",
    title: "Enterprise",
    headline: "Trust That Scales With Your Business",
    body:
      "Protect your networks, devices, and data — both in motion and at rest — without replacing your existing security stack. SelectiveTRUST® integrates with your current architecture and speeds digital transformation. Secure partner ecosystems, AI deployments, and critical infrastructure without operational complexity.",
    outcomes: [
      "Stack-integrated — no rip and replace required",
      "Partner ecosystem trust without data exposure",
      "AI system security and provable auditability",
      "Credential misuse and lateral movement prevention",
    ],
    accent: "border-blue-600/40",
    tagColor: "text-blue-400",
  },
];

export default function WhatWeDoPage() {
  return (
    <div className="bg-navy-900 pt-20">
      {/* ── HERO ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-trust-600/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 trust-badge px-4 py-2 rounded-full mb-6">
              <svg className="w-4 h-4 text-sovereign-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm text-slate-300 font-medium">Our Solution</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              Selective
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-trust-400 to-sovereign-400">
                TRUST
              </span>
              <sup className="text-sovereign-400 text-2xl md:text-3xl">®</sup>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed mb-6">
              A groundbreaking architecture for multi-domain interoperability
              that establishes{" "}
              <span className="text-white font-semibold">
                device-rooted, verifiable trust relationships
              </span>{" "}
              — preserving sovereignty while enabling on-demand trusted collaboration.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed">
              SelectiveTRUST® operates on the control plane. It manages trust.
              It never touches your data. It integrates with your existing stack.
              It is available now.
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 bg-navy-950 relative">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block trust-badge px-3 py-1 rounded-full text-xs font-semibold text-trust-300 mb-4">
              HOW IT WORKS
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              The SelectiveTRUST®{" "}
              <span className="gradient-text">Trust Cycle</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Every communication. Every transaction. Every device.
              Trust is established, verified, and destroyed — in real time.
            </p>
          </div>

          <div className="space-y-6">
            {howItWorks.map((step, i) => (
              <div
                key={step.step}
                className={`group flex gap-8 items-start bg-navy-800/60 border border-white/8 hover:border-trust-600/30 rounded-2xl p-8 backdrop-blur-sm transition-all duration-300 card-hover ${
                  i % 2 === 0 ? "" : "flex-row-reverse"
                }`}
              >
                {/* Step number */}
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-trust-600 to-sovereign-600 flex items-center justify-center shadow-trust">
                  <span className="text-white font-black text-lg">{step.step}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-xl mb-3">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed mb-3">{step.description}</p>
                  <div className="inline-flex items-center gap-2 text-sm text-sovereign-400 font-mono">
                    <span className="w-1 h-1 rounded-full bg-sovereign-400" />
                    {step.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES GRID ── */}
      <section id="capabilities" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 hex-pattern" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block trust-badge px-3 py-1 rounded-full text-xs font-semibold text-trust-300 mb-4">
              CAPABILITIES
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              What SelectiveTRUST®{" "}
              <span className="gradient-text-sovereign">Delivers</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {capabilities.map((cap) => (
              <div
                key={cap.title}
                className="group bg-navy-800/60 border border-white/8 hover:border-trust-600/30 rounded-2xl p-5 backdrop-blur-sm card-hover"
              >
                <div className="w-9 h-9 rounded-lg bg-trust-600/20 border border-trust-600/30 flex items-center justify-center text-trust-400 mb-4">
                  {cap.icon}
                </div>
                <h3 className="text-white font-bold text-sm mb-2">{cap.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{cap.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section id="integration" className="py-24 bg-navy-950 relative">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block trust-badge px-3 py-1 rounded-full text-xs font-semibold text-trust-300 mb-4">
              USE CASES
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              SelectiveTRUST® Across{" "}
              <span className="gradient-text">Every Domain</span>
            </h2>
          </div>

          <div className="space-y-8">
            {useCases.map((uc) => (
              <div
                key={uc.id}
                id={uc.id}
                className={`bg-navy-800/60 border ${uc.accent} rounded-2xl p-10 backdrop-blur-sm`}
              >
                <div className="grid lg:grid-cols-2 gap-10 items-start">
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-widest ${uc.tagColor} mb-3 block`}>
                      {uc.title}
                    </span>
                    <h3 className="text-white font-bold text-2xl mb-4">{uc.headline}</h3>
                    <p className="text-slate-400 leading-relaxed">{uc.body}</p>
                  </div>
                  <div>
                    <p className="text-slate-300 font-semibold text-sm mb-4">Key Outcomes</p>
                    <ul className="space-y-3">
                      {uc.outcomes.map((outcome) => (
                        <li key={outcome} className="flex items-start gap-3 text-slate-400 text-sm">
                          <svg className={`w-4 h-4 mt-0.5 flex-shrink-0 ${uc.tagColor}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPLIANCE BAND ── */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-slate-300 font-semibold mb-1">Compliance & Certifications</p>
              <p className="text-slate-500 text-sm">SelectiveTRUST® meets the highest standards for security and compliance</p>
            </div>
            <div className="flex flex-wrap gap-4">
              {[
                { label: "FIPS 140-2 Validated", sub: "Mode of operation validated" },
                { label: "FIPS 203-Capable", sub: "Post-quantum ready" },
                { label: "SOC 2 Audited", sub: "Trust & availability" },
                { label: "Zero Trust Aligned", sub: "Extends NIST 800-207" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="trust-badge px-4 py-2.5 rounded-xl text-center"
                >
                  <div className="text-white font-bold text-sm">{badge.label}</div>
                  <div className="text-slate-500 text-xs">{badge.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-trust-600/10 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-5">
            See SelectiveTRUST® in action
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Request a technical briefing and discover how SelectiveTRUST®
            can integrate with your architecture to deliver provable sovereign trust — today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-trust-600 to-trust-700 hover:from-trust-500 hover:to-trust-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-trust hover:shadow-trust-lg"
            >
              Request a Technical Briefing
            </Link>
            <Link
              href="/why-knectiq"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200"
            >
              Why KnectIQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
