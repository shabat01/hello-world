import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact KnectIQ — Request a Briefing",
  description:
    "Request a technical briefing from KnectIQ's SelectiveTRUST® architects. Discover how programmable sovereign trust integrates with your environment.",
};

const contactReasons = [
  {
    title: "Technical Briefing",
    description: "Deep-dive walkthrough of SelectiveTRUST® architecture tailored to your environment and requirements.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Integration Assessment",
    description: "Evaluate how SelectiveTRUST® integrates with your current security stack and infrastructure.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
  },
  {
    title: "Partnership & Licensing",
    description: "Explore licensing agreements, OEM integration, and strategic partnership opportunities.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: "Media & Analyst Inquiry",
    description: "Press inquiries, analyst briefings, and speaking engagement requests.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <div className="bg-navy-900 pt-20">
      {/* ── HERO ── */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-trust-600/8 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-block trust-badge px-3 py-1 rounded-full text-xs font-semibold text-trust-300 mb-6">
              GET IN TOUCH
            </div>
            <h1 className="text-5xl font-black text-white mb-4 leading-tight">
              Let&apos;s Talk{" "}
              <span className="gradient-text">Trust</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Whether you&apos;re evaluating SelectiveTRUST® for a specific mission,
              exploring integration, or want to understand how programmable sovereign
              trust changes your security posture — our team is ready.
            </p>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTACT SECTION ── */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Contact form */}
            <div className="bg-navy-800/60 border border-white/8 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-2">Request a Briefing</h2>
              <p className="text-slate-400 text-sm mb-8">
                Our architects will follow up within one business day.
              </p>

              <form className="space-y-5" action="#" method="POST">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-1.5">
                      First Name <span className="text-trust-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full bg-navy-700/60 border border-white/10 focus:border-trust-500/60 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm outline-none transition-colors"
                      placeholder="Jane"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-1.5">
                      Last Name <span className="text-trust-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full bg-navy-700/60 border border-white/10 focus:border-trust-500/60 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm outline-none transition-colors"
                      placeholder="Smith"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Work Email <span className="text-trust-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full bg-navy-700/60 border border-white/10 focus:border-trust-500/60 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm outline-none transition-colors"
                    placeholder="jane.smith@organization.gov"
                  />
                </div>

                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Organization <span className="text-trust-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    required
                    className="w-full bg-navy-700/60 border border-white/10 focus:border-trust-500/60 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm outline-none transition-colors"
                    placeholder="Department of Defense"
                  />
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Title / Role
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="w-full bg-navy-700/60 border border-white/10 focus:border-trust-500/60 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm outline-none transition-colors"
                    placeholder="CISO, Program Manager, CTO..."
                  />
                </div>

                <div>
                  <label htmlFor="inquiry" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Type of Inquiry <span className="text-trust-400">*</span>
                  </label>
                  <select
                    id="inquiry"
                    name="inquiry"
                    required
                    className="w-full bg-navy-700/60 border border-white/10 focus:border-trust-500/60 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors appearance-none"
                  >
                    <option value="" className="bg-navy-800">Select an option</option>
                    <option value="technical-briefing" className="bg-navy-800">Technical Briefing</option>
                    <option value="integration" className="bg-navy-800">Integration Assessment</option>
                    <option value="partnership" className="bg-navy-800">Partnership / Licensing</option>
                    <option value="media" className="bg-navy-800">Media / Analyst Inquiry</option>
                    <option value="other" className="bg-navy-800">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Tell us about your environment or use case
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full bg-navy-700/60 border border-white/10 focus:border-trust-500/60 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm outline-none transition-colors resize-none"
                    placeholder="Describe your organization's trust challenges, security environment, or the specific mission context you'd like to discuss..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-trust-600 to-trust-700 hover:from-trust-500 hover:to-trust-600 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-trust hover:shadow-trust-lg text-sm"
                >
                  Submit Request
                </button>

                <p className="text-slate-500 text-xs text-center">
                  By submitting this form, you agree to our Privacy Policy.
                  We never share your information with third parties.
                </p>
              </form>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Inquiry types */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4">How Can We Help?</h3>
                <div className="space-y-3">
                  {contactReasons.map((reason) => (
                    <div
                      key={reason.title}
                      className="bg-navy-800/60 border border-white/8 rounded-xl p-5 backdrop-blur-sm flex gap-4"
                    >
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-trust-600/20 border border-trust-600/30 flex items-center justify-center text-trust-400">
                        {reason.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm mb-1">{reason.title}</h4>
                        <p className="text-slate-400 text-xs leading-relaxed">{reason.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct contact */}
              <div className="bg-navy-800/60 border border-white/8 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold text-sm mb-4">Direct Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <svg className="w-4 h-4 text-trust-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-slate-400">info@knectiq.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <svg className="w-4 h-4 text-trust-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-slate-400">Roseville, Minnesota, USA</span>
                  </div>
                </div>
              </div>

              {/* Trust assurance */}
              <div className="bg-gradient-to-br from-trust-600/10 to-sovereign-600/5 border border-trust-600/20 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-trust-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">
                      Security-First Communication
                    </p>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      All inquiries are handled with strict confidentiality.
                      For classified discussions, our team can arrange secure
                      communication channels appropriate to your classification level.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RESPONSE GUARANTEE ── */}
      <section className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              {
                icon: "⚡",
                title: "1 Business Day",
                sub: "Response time commitment for all inquiries",
              },
              {
                icon: "🔐",
                title: "Full Confidentiality",
                sub: "Your information and use case details are strictly protected",
              },
              {
                icon: "🎯",
                title: "Mission-Tailored",
                sub: "Every briefing is customized to your specific environment and needs",
              },
            ].map((item) => (
              <div key={item.title} className="bg-navy-800/40 border border-white/5 rounded-xl p-6">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="text-white font-bold mb-1">{item.title}</div>
                <div className="text-slate-500 text-xs">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
