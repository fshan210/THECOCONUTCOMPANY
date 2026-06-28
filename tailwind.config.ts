import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F7F0E4",
        porcelain: "#FFFFFF",
        ink: "#15110D",
        muted: "#7A6A58",
        coconut: "#3A2416",
        grove: "#0F4F3A",
        palm: "#5E8C51",
        sun: "#F4C95D",
        clay: "#F4C95D",
        shell: "rgba(58,36,22,0.18)"
      },
      fontFamily: {
        display: ["var(--font-co-display)", "Georgia", "serif"],
        sans: ["var(--font-co-sans)", "Inter", "Avenir Next", "Helvetica Neue", "Arial", "sans-serif"]
      },
      letterSpacing: {
        editorial: "0.08em"
      },
      boxShadow: {
        soft: "0 28px 80px rgba(33, 25, 21, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
