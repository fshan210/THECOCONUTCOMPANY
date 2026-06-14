import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F5EBD7",
        porcelain: "#fffdf8",
        ink: "#2d2d2d",
        muted: "#76695f",
        coconut: "#3e2e1f",
        grove: "#4A6F4A",
        palm: "#A8B07B",
        sun: "#D8C07A",
        clay: "#b88664",
        shell: "#e9dfd1"
      },
      fontFamily: {
        display: ["var(--font-brand)", "Roboto", "Inter", "Avenir Next", "Helvetica Neue", "Arial", "sans-serif"],
        sans: ["var(--font-brand)", "Roboto", "Inter", "Avenir Next", "Helvetica Neue", "Arial", "sans-serif"]
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
