import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./constants/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        success: {
          25: "#F6FEF9",
          50: "#ECFDF3",
          100: "#D1FADF",
          600: "#039855",
          700: "#027A48",
          900: "#054F31",
        },
        primary: {
          100: "#67B3D94F",
          200: '#2B4864',
          300: "#224667",
          500: '#26619C',
          700: '#E9F4FA',
          800: '#2668A5',
          900: "#1E3D5A",
        },
        gray: {
          100: '#26619C33',
          200: '#26619C',
          300: "#A3A0A0",
          400: "#A1A1A1",
          500: "#807F7F",
          600: '#353535E3',
          700: '#EAF5FB',
          800: '#F7F7F7'
        },
        yellow: {
          500: "#FFEB84",
        },
        dark: {
          400: '#4D4D4D',
          500: "#252525",
          600: "#1F1F1F",
          700: '#363636'
        },
      },
      backgroundImage: {
        "blue-gradient":
          "linear-gradient(90.28deg, #2B4864 0.25%, #6DBEE5 107.4%)",
        "blue-gradient-hover":
          "linear-gradient(90.28deg, #6DBEE5 0%, #2B4864 100%)",
      },
      boxShadow: {
        'top-news': '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
      },
      fontFamily: {
        "Century-751-BT": ["Century-BT", "sans-serif"],
        "century-schoolbook": ["century-schoolbook", "sans-serif"],
        "century-gothic": ["century-gothic", "sans-serif"],
        "font-century-725-cn": ["Century-725-CN", "sans-serif"],
        inter: ['Inter', 'sans-serif'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
