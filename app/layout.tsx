import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "KnectIQ | Programmable Sovereign Trust Architecture",
    template: "%s | KnectIQ",
  },
  description:
    "KnectIQ pioneers programmable sovereign trust architectures with SelectiveTRUST® — the patented technology establishing device-rooted, verifiable trust relationships protecting data, networks, and AI systems across any domain.",
  keywords: [
    "sovereign trust",
    "SelectiveTRUST",
    "zero trust",
    "programmable trust",
    "cybersecurity",
    "defense",
    "quantum resistant",
    "data sovereignty",
    "KnectIQ",
    "trust architecture",
    "ephemeral keys",
  ],
  authors: [{ name: "KnectIQ Inc." }],
  creator: "KnectIQ Inc.",
  publisher: "KnectIQ Inc.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.knectiq.com",
    siteName: "KnectIQ",
    title: "KnectIQ | Programmable Sovereign Trust Architecture",
    description:
      "Establish verifiable, programmable trust across any domain. SelectiveTRUST® by KnectIQ.",
  },
  twitter: {
    card: "summary_large_image",
    title: "KnectIQ | Programmable Sovereign Trust Architecture",
    description:
      "Establish verifiable, programmable trust across any domain. SelectiveTRUST® by KnectIQ.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-navy-900 antialiased">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
