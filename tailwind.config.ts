import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "#7A6A58",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        paper: "#F7F0E4",
        porcelain: "#FFFFFF",
        ink: "#15110D",
        coconut: "#3A2416",
        grove: "#0F4F3A",
        palm: "#5E8C51",
        sun: "#F4C95D",
        clay: "#F4C95D",
        shell: "rgba(58,36,22,0.18)"
      },
      fontFamily: {
        display: ["var(--font-co-sans)", "Roboto", "Arial", "sans-serif"],
        editorial: ["var(--font-co-editorial)", "Georgia", "serif"],
        sans: ["var(--font-co-sans)", "Roboto", "Arial", "sans-serif"]
      },
      letterSpacing: {
        editorial: "0.08em"
      },
      boxShadow: {
        soft: "0 28px 80px rgba(33, 25, 21, 0.08)",
        glass: "0 24px 80px rgba(62, 46, 31, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.62)",
        neu: "12px 12px 32px rgba(62, 46, 31, 0.10), -10px -10px 26px rgba(255, 255, 255, 0.72)"
      },
      borderRadius: {
        "co-sm": "var(--co-radius-sm)",
        "co-md": "var(--co-radius-md)",
        "co-lg": "var(--co-radius-lg)",
        "co-xl": "56px"
      },
      backdropBlur: {
        premium: "22px"
      }
    }
  },
  plugins: [animate]
};

export default config;
