import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B1D33",
          50: "#f3f6fb",
          100: "#e2e9f3",
          200: "#c2d0e3",
          300: "#94acc8",
          400: "#5f82a8",
          500: "#3f648c",
          600: "#2f4d71",
          700: "#263e5c",
          800: "#1b2e47",
          900: "#13213a",
          950: "#0B1D33"
        },
        gold: {
          DEFAULT: "#C6A15B",
          50: "#fbf7ee",
          100: "#f5ecd6",
          200: "#ecd9ad",
          300: "#e2c37d",
          400: "#d6ac5f",
          500: "#C6A15B",
          600: "#a97f3d",
          700: "#8c6532",
          800: "#72522c",
          900: "#5e4528"
        },
        ivory: { DEFAULT: "#F5F0E6" },
        emerald: { DEFAULT: "#0E7C7B" },
        rosegold: { DEFAULT: "#B76E79" }
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Montserrat", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        gold: "0 4px 30px rgba(198,161,91,0.25)",
        card: "0 10px 40px rgba(11,29,51,0.12)"
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "spin-slow": "spin 12s linear infinite"
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      }
    }
  },
  plugins: []
};

export default config;
