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
        paper: "#f7f3ec",
        porcelain: "#fffdf8",
        ink: "#211915",
        muted: "#76695f",
        coconut: "#654026",
        grove: "#4a6f4a",
        clay: "#b88664",
        shell: "#e9dfd1"
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "Times New Roman", "serif"],
        sans: ["Inter", "Avenir Next", "Helvetica Neue", "Arial", "sans-serif"]
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
