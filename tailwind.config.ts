import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#08080a",
        surface: "#0f0f12",
        "surface-2": "#161619",
        accent: "#c9a84c",
        "accent-hover": "#dbbf6a",
        "accent-dim": "rgba(201, 168, 76, 0.1)",
        muted: "#7a7670",
        foreground: "#f0ece6",
      },
      fontFamily: {
        display: ['"Bebas Neue"', "sans-serif"],
        body: ['"Outfit"', "sans-serif"],
      },
      animation: {
        marquee: "marquee 25s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
