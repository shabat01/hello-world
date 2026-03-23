import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // KnectIQ Brand Palette
        navy: {
          950: "#03080f",
          900: "#050c1a",
          800: "#0a1628",
          700: "#0f1e3a",
          600: "#142448",
          500: "#1a2d5a",
        },
        trust: {
          50: "#eff8ff",
          100: "#dbeffe",
          200: "#b9e0fd",
          300: "#83cbfc",
          400: "#46aff8",
          500: "#1a90f4",
          600: "#0872e9",
          700: "#085dd6",
          800: "#0c4cad",
          900: "#104188",
          950: "#0c2957",
        },
        sovereign: {
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
        },
        mark: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(30,64,175,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(30,64,175,0.08) 1px, transparent 1px)",
        "hero-gradient":
          "radial-gradient(ellipse at 20% 50%, rgba(8,114,233,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(6,182,212,0.1) 0%, transparent 50%)",
        "trust-gradient":
          "linear-gradient(135deg, #050c1a 0%, #0a1628 50%, #0f1e3a 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(15,30,58,0.8) 0%, rgba(10,22,40,0.9) 100%)",
        "cta-gradient":
          "linear-gradient(135deg, #0872e9 0%, #0891b2 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "scan-line": "scanLine 3s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(8,114,233,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(8,114,233,0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      boxShadow: {
        "trust": "0 0 30px rgba(8,114,233,0.2)",
        "trust-lg": "0 0 60px rgba(8,114,233,0.3)",
        "sovereign": "0 0 30px rgba(6,182,212,0.2)",
        "card": "0 4px 24px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
