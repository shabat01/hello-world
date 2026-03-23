import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About KnectIQ — The Sovereign Trust Company",
  description:
    "KnectIQ is a pioneer in programmable sovereign trust solutions. Learn about our mission, founding story, and the team behind SelectiveTRUST®.",
};

const values = [
  {
    title: "Sovereignty First",
    description:
      "We believe every nation and every enterprise has the right to true digital sovereignty — not the illusion of it. Everything we build starts with this principle.",
    icon: "🏛️",
  },
  {
    title: "Trust Must Be Provable",
    description:
      "Asserted trust is not trust. We engineer cryptographic proof into every communication, every device interaction, every transaction.",
    icon: "🔬",
  },
  {
    title: "Complexity Is the Enemy",
    description:
      "The most secure architectures are the ones that get deployed. We build technology that integrates without disruption and operates without operational burden.",
    icon: "⚡",
  },
  {
    title: "Mission Drives Everything",
    description:
      "Whether it's a warfighter at the tactical edge or a regulated enterprise protecting patient data — mission success is our definition of success.",
    icon: "🎯",
  },
  {
    title: "Diversity of Thought",
    description:
      "As a minority-founded and led company, we know that diverse perspectives produce stronger architectures, better products, and more resilient solutions.",
    icon: "🌍",
  },
  {
    title: "Zero Compromise on Security",
    description:
      "We hold our technology to the highest standards — FIPS, SOC 2, and defense-grade operational validation. If it isn't provably secure, we don't ship it.",
    icon: "🛡️",
  },
];

const milestones = [
  {
    year: "Founded",
    event: "KnectIQ Inc. established",
    detail: "Founded with a singular mission: solve the programmable sovereign trust problem that no one else was solving.",
  },
  {
    year: "Patent",
    event: "Core SelectiveTRUST® patents granted",
    detail: "Foundational patents covering ephemeral key generation, device-rooted trust relationships, and control-plane trust architecture secured.",
  },
  {
    year: "FIPS",
    event: "FIPS 140-2 validation achieved",
    detail: "SelectiveTRUST® achieves FIPS 140-2 validated mode of operation, exceeding standard key security requirements.",
  },
  {
    year: "SOC 2",
    event: "SOC 2 Audit completed",
    detail: "Independent audit confirms KnectIQ's security, availability, and confidentiality controls meet the highest enterprise standards.",
  },
  {
    year: "SRC UK",
    event: "International licensing agreement with SRC UK",
    detail: "SelectiveTRUST® technology licensed to power next-generation intelligence and defense platforms across UK, USA, Europe, and allied nations.",
  },
  {
    year: "FIPS 203",
    event: "Post-quantum capability delivered",
    detail: "SelectiveTRUST® achieves FIPS 203-capable operation, delivering quantum-resistant trust architecture to customers today.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-navy-900 pt-20">
      {/* ── HERO ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-trust-600/6 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block trust-badge px-3 py-1 rounded-full text-xs font-semibold text-trust-300 mb-6">
                ABOUT KNECTIQ
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
                The{" "}
                <span className="gradient-text">Sovereign Trust</span>{" "}
                Company
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed mb-6">
                KnectIQ was formed to fill a gap that no one else was filling:
                the gap between Zero Trust principles and truly engineered,
                programmable, provable trust.
              </p>
              <p className="text-slate-400 leading-relaxed">
                We are a privately held, minority-founded and led cybersecurity
                technology company based in Roseville, Minnesota — and we are
                pioneers in sovereign digital trust solutions. Our patented
                SelectiveTRUST® technology is the result of deep research into
                the fundamental nature of trust in digital systems.
              </p>
            </div>

            {/* Mission card */}
            <div className="bg-navy-800/60 border border-trust-600/20 rounded-2xl p-8 backdrop-blur-sm">
              <div className="mb-6">
                <div className="text-xs font-bold uppercase tracking-widest text-trust-400 mb-3">Our Mission</div>
                <p className="text-2xl font-bold text-white leading-snug">
                  To deliver{" "}
                  <span className="gradient-text-trust">absolute trust</span>{" "}
                  through programmable, sovereign, provable cryptographic architecture.
                </p>
              </div>
              <div className="border-t border-white/10 pt-6">
                <div className="text-xs font-bold uppercase tracking-widest text-sovereign-400 mb-3">Our Vision</div>
                <p className="text-slate-300 leading-relaxed">
                  A world where every government, enterprise, and military
                  can collaborate securely across any domain — with full
                  cryptographic proof and without sacrificing sovereignty.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="py-24 bg-navy-950 relative">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block trust-badge px-3 py-1 rounded-full text-xs font-semibold text-trust-300 mb-6">
              OUR STORY
            </div>
            <h2 className="text-4xl font-bold text-white mb-8 leading-tight">
              Built to Disrupt. Engineered to{" "}
              <span className="gradient-text-sovereign">Last.</span>
            </h2>

            <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
              <p>
                KnectIQ was formed with a disruptive mandate: advance security
                frameworks beyond their current limitations using a transformational
                approach that achieves the mission of absolute trust.
              </p>
              <p>
                The founders recognized that the security industry had built
                increasingly sophisticated perimeters while ignoring the deeper
                problem — trust itself was not being engineered. It was being assumed.
                Asserted. Approximated. But never proven.
              </p>
              <p>
                The result was SelectiveTRUST® — a patented architecture that treats
                trust as a cryptographic primitive, not a policy or a perimeter.
                Device-rooted. Ephemeral. Verifiable. Sovereign. Built for real-time
                operation in the most demanding environments on earth.
              </p>
              <p>
                Today, SelectiveTRUST® protects communications and data across
                defense, intelligence, government, and enterprise environments —
                enabling the kind of trusted collaboration that was previously
                impossible without ceding control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 hex-pattern" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block trust-badge px-3 py-1 rounded-full text-xs font-semibold text-trust-300 mb-4">
              MILESTONES
            </div>
            <h2 className="text-4xl font-bold text-white">
              Building the Trust{" "}
              <span className="gradient-text">Architecture of the Future</span>
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-trust-600/50 via-sovereign-500/30 to-transparent hidden lg:block" />

            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div
                  key={m.year}
                  className={`relative flex items-start gap-8 ${
                    i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div className="flex-1 bg-navy-800/60 border border-white/8 hover:border-trust-600/30 rounded-2xl p-6 backdrop-blur-sm card-hover">
                    <div className="text-xs font-bold uppercase tracking-widest text-trust-400 mb-2">
                      {m.year}
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{m.event}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{m.detail}</p>
                  </div>

                  {/* Center dot (desktop) */}
                  <div className="hidden lg:flex flex-shrink-0 w-4 h-4 rounded-full bg-trust-600 border-2 border-navy-950 mt-6 shadow-trust z-10" />

                  {/* Spacer for alternating layout */}
                  <div className="flex-1 hidden lg:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-24 bg-navy-950 relative">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block trust-badge px-3 py-1 rounded-full text-xs font-semibold text-trust-300 mb-4">
              OUR VALUES
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              What We Stand For
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              These principles guide every architectural decision, every product feature,
              and every customer engagement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-navy-800/60 border border-white/8 hover:border-trust-600/30 rounded-2xl p-6 backdrop-blur-sm card-hover"
              >
                <div className="text-3xl mb-4">{v.icon}</div>
                <h3 className="text-white font-bold text-lg mb-3">{v.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FACTS BAND ── */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "Patented", label: "Core Technology", sub: "SelectiveTRUST® architecture" },
              { value: "Minority", label: "Founded & Led", sub: "Diverse, mission-driven team" },
              { value: "Minnesota", label: "Headquartered", sub: "Roseville, MN, USA" },
              { value: "Allied", label: "Nations Served", sub: "US, UK, Europe, Australia +" },
            ].map((fact) => (
              <div key={fact.label}>
                <div className="text-2xl font-black gradient-text-trust mb-1">{fact.value}</div>
                <div className="text-white font-semibold text-sm">{fact.label}</div>
                <div className="text-slate-500 text-xs mt-0.5">{fact.sub}</div>
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
            Join the Provable Trust Era
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Whether you&apos;re a government agency protecting national interests,
            a defense integrator securing coalition networks, or an enterprise
            protecting critical infrastructure — KnectIQ has a trust architecture for you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-trust-600 to-trust-700 hover:from-trust-500 hover:to-trust-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-trust"
            >
              Get in Touch
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
