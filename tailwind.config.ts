import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: "#0A0A0B",
          deep: "#050505",
          raised: "#161616",
        },
        brand: {
          DEFAULT: "#A6CE39",
          bright: "#C7E56F",
          dim: "#6E8A26",
          deep: "#465A18",
        },
        graphite: {
          DEFAULT: "#4A4A4A",
          light: "#8C8C8C",
          dark: "#1C1C1C",
        },
        stardust: {
          DEFAULT: "#F2F2EF",
          dim: "#B4B4B0",
          faint: "#6C6C69",
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
        "float-slow": {
          "0%, 100%": { transform: "translate(0px, 0px)" },
          "50%": { transform: "translate(10px, -22px)" },
        },
        "float-med": {
          "0%, 100%": { transform: "translate(0px, 0px) rotate(0deg)" },
          "50%": { transform: "translate(-14px, 16px) rotate(4deg)" },
        },
        "float-fast": {
          "0%, 100%": { transform: "translate(0px, 0px)" },
          "50%": { transform: "translate(8px, 12px)" },
        },
      },
      animation: {
        twinkle: "twinkle 4s ease-in-out infinite",
        drift: "drift 8s ease-in-out infinite",
        "spin-slow": "spin-slow 90s linear infinite",
        "float-slow": "float-slow 13s ease-in-out infinite",
        "float-med": "float-med 9s ease-in-out infinite",
        "float-fast": "float-fast 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
