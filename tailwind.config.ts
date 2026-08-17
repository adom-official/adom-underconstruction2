import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: "#07060B",
          deep: "#050408",
          raised: "#0F0D18",
        },
        nebula: {
          DEFAULT: "#4B3A86",
          soft: "#6B4FA0",
          glow: "#8A6FD6",
        },
        aurum: {
          DEFAULT: "#C9A467",
          bright: "#E4C58B",
          dim: "#8A703F",
        },
        stardust: {
          DEFAULT: "#F4F1EA",
          dim: "#B9B5C4",
          faint: "#6E6A7C",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        widest2: "0.35em",
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(circle at 50% 30%, rgba(138,111,214,0.16) 0%, rgba(7,6,11,0) 60%)",
      },
      keyframes: {
        "twinkle": {
          "0%, 100%": { opacity: "0.25" },
          "50%": { opacity: "1" },
        },
        "drift": {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
          "100%": { transform: "translateY(0px)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        twinkle: "twinkle 4s ease-in-out infinite",
        drift: "drift 8s ease-in-out infinite",
        "spin-slow": "spin-slow 90s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
