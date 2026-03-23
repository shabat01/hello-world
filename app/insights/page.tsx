import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights — Trust, Sovereignty & the Future of Security",
  description:
    "KnectIQ's perspective on programmable sovereign trust, Zero Trust architecture, quantum-era security, and the geoeconomics of digital sovereignty.",
};

const featured = {
  category: "Thought Leadership",
  title: "The Provable Trust Era: Sovereignty, National Security, and the Architecture of Resilient Global Collaboration",
  excerpt:
    "We are in a structural transition toward a geoeconomic world where trade, capital, technology, energy, and data are outsized instruments of national advantage. At the center of this transition is a question that most security architectures cannot answer: can you prove your trust?",
  href: "/insights/provable-trust-era",
  date: "2025",
  readTime: "12 min read",
  tags: ["Sovereignty", "National Security", "Trust Architecture"],
};

const articles = [
  {
    category: "Analysis",
    title: "The Sovereignty Illusion: Why Spending Billions on AI Infrastructure Buys You Neither Sovereign AI nor Security Independence",
    excerpt:
      "Full digital sovereignty — owning every chip, every cable, every line of software — is expensive and largely unattainable for most nations. But security sovereignty is different, and it is achievable today.",
    href: "/insights/sovereignty-illusion",
    date: "2025",
    readTime: "9 min read",
    tags: ["AI Security", "Sovereignty", "National Policy"],
  },
  {
    category: "Defense",
    title: "Secure Comms with Allies: What the Pentagon Needs Now",
    excerpt:
      "Multi-domain operations demand trusted communication across coalition networks. The challenge isn't bandwidth — it's trust. Here's the architectural answer.",
    href: "/insights/secure-comms-allies-pentagon",
    date: "2025",
    readTime: "7 min read",
    tags: ["Defense", "Coalition Operations", "Zero Trust"],
  },
  {
    category: "News",
    title: "KnectIQ and SRC UK Forge Licensing Agreement to Power Next-Generation Intelligence and Defense Platforms",
    excerpt:
      "Under the agreement, SRC UK will integrate KnectIQ's patented SelectiveTRUST® technology into select commercial and defense intelligence platforms, delivering performance, cost efficiency, and security to customers across the UK, USA, Europe, Australia, and allied nations.",
    href: "/insights/src-uk-licensing",
    date: "2025",
    readTime: "4 min read",
    tags: ["News", "Partnership", "Defense"],
  },
  {
    category: "Technology",
    title: "Ephemeral Keys: Why Single-Use Cryptography Changes Everything",
    excerpt:
      "The most persistent vulnerability in modern cryptographic deployments is the persistence of keys themselves. Here's why eliminating key persistence through ephemeral key architecture is the most important advance in practical cryptography in a generation.",
    href: "/insights/ephemeral-keys",
    date: "2025",
    readTime: "8 min read",
    tags: ["Cryptography", "Architecture", "Technology"],
  },
  {
    category: "Zero Trust",
    title: "Beyond Zero Trust: Why Programmable Trust Fabrics Complete the Architecture",
    excerpt:
      "NIST 800-207 defines the principles of Zero Trust well. What it doesn't address is how to engineer trust itself — the cryptographic layer below identity and access management. SelectiveTRUST® fills that gap.",
    href: "/insights/beyond-zero-trust",
    date: "2025",
    readTime: "10 min read",
    tags: ["Zero Trust", "Architecture", "NIST"],
  },
  {
    category: "Quantum",
    title: "Post-Quantum Readiness Is Not Optional: A Framework for Security Sovereignty",
    excerpt:
      "The quantum threat to current cryptographic infrastructure is a matter of when, not if. Organizations that delay post-quantum cryptographic migration are building temporal vulnerabilities into their sovereign trust foundations.",
    href: "/insights/post-quantum-readiness",
    date: "2025",
    readTime: "11 min read",
    tags: ["Quantum", "FIPS 203", "Cryptography"],
  },
];

const categories = ["All", "Thought Leadership", "Analysis", "Defense", "Technology", "Zero Trust", "Quantum", "News"];

export default function InsightsPage() {
  return (
    <div className="bg-navy-900 pt-20">
      {/* ── HERO ── */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-block trust-badge px-3 py-1 rounded-full text-xs font-semibold text-trust-300 mb-6">
              INSIGHTS
            </div>
            <h1 className="text-5xl font-black text-white mb-4 leading-tight">
              Thinking About{" "}
              <span className="gradient-text">Trust</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              KnectIQ&apos;s perspective on sovereign trust, quantum-era security,
              Zero Trust architecture, and the geoeconomics of digital sovereignty.
            </p>
          </div>
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section className="pb-12 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link
            href={featured.href}
            className="group block bg-navy-800/60 border border-trust-600/25 hover:border-trust-600/50 rounded-2xl p-10 backdrop-blur-sm transition-all duration-300 card-hover"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-trust-400">
                    {featured.category}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs text-slate-500">{featured.date}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs text-slate-500">{featured.readTime}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-4 group-hover:text-trust-300 transition-colors">
                  {featured.title}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {featured.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-trust-600/15 border border-trust-600/25 text-trust-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-slate-400 leading-relaxed text-lg">{featured.excerpt}</p>
                <div className="mt-6 flex items-center gap-2 text-trust-400 font-semibold">
                  Read the full piece
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── FILTER TABS ── */}
      <section className="pb-8 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  i === 0
                    ? "bg-trust-600/20 border border-trust-600/40 text-trust-300"
                    : "bg-navy-800/60 border border-white/8 text-slate-400 hover:text-white hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARTICLES GRID ── */}
      <section className="pb-24 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.title}
                href={article.href}
                className="group bg-navy-800/60 border border-white/8 hover:border-trust-600/30 rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 card-hover flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-trust-400">
                    {article.category}
                  </span>
                  <span className="text-xs text-slate-500">{article.readTime}</span>
                </div>

                <h3 className="text-white font-bold text-base leading-snug mb-3 group-hover:text-trust-300 transition-colors flex-1">
                  {article.title}
                </h3>

                <p className="text-slate-400 text-sm leading-relaxed mb-5 line-clamp-3">
                  {article.excerpt}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/8">
                  <span className="text-slate-500 text-xs">{article.date}</span>
                  <div className="flex items-center gap-1 text-trust-400 text-xs font-medium">
                    Read
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUBSCRIBE CTA ── */}
      <section className="py-16 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-trust-600/10 rounded-full blur-3xl" />
        <div className="relative max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay ahead of the trust curve
          </h2>
          <p className="text-slate-400 mb-8">
            Get KnectIQ&apos;s insights on sovereign trust, quantum security,
            and programmable trust architectures delivered to your inbox.
          </p>
          <form className="flex gap-3 max-w-md mx-auto" action="#" method="POST">
            <input
              type="email"
              placeholder="your@organization.gov"
              className="flex-1 bg-navy-700/60 border border-white/10 focus:border-trust-500/60 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm outline-none transition-colors"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-trust-600 to-trust-700 hover:from-trust-500 hover:to-trust-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-trust text-sm whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
