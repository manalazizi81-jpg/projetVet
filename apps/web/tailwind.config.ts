import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          950: "#0B2318",
          900: "#1B4332",
          800: "#2D6A4F",
          700: "#40916C",
          600: "#52B788",
          500: "#74C69D",
          400: "#95D5B2",
          300: "#B7E4C7",
          200: "#D8F3DC",
          100: "#EDF7F0",
          50:  "#F5FBF7",
        },
        amber: {
          600: "#B8860B",
          500: "#D4A017",
          400: "#E8B931",
          300: "#F0D060",
          200: "#FBE8A6",
          100: "#FEF6D8",
        },
        shell: "#FAFAF5",
        ink: "#1A1A2E",
        muted: "#4A5568",
        border: "#E2E8E0",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        blob: "60% 40% 30% 70% / 60% 30% 70% 40%",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(37, 211, 102, 0.5)" },
          "50%": { boxShadow: "0 0 0 14px rgba(37, 211, 102, 0)" },
        },
      },
      animation: {
        marquee: "marquee 35s linear infinite",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
