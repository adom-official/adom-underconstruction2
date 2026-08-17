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
        "sweep": {
          "0%": { transform: "translate3d(-45vw, -10vh, 0) rotate(18deg)" },
          "50%": { transform: "translate3d(45vw, 10vh, 0) rotate(18deg)" },
          "100%": { transform: "translate3d(-45vw, -10vh, 0) rotate(18deg)" },
        },
      },
      animation: {
        twinkle: "twinkle 4s ease-in-out infinite",
        drift: "drift 8s ease-in-out infinite",
        "spin-slow": "spin-slow 90s linear infinite",
        "float-slow": "float-slow 13s ease-in-out infinite",
        "float-med": "float-med 9s ease-in-out infinite",
        "float-fast": "float-fast 6s ease-in-out infinite",
        sweep: "sweep 16s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
