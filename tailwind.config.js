/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // LynQ Brand Colors
        gold: "#D4AF37",
        "gold-light": "#F5D98C",

        // Dark Mode Palette
        "lynq-black": "#000000",
        "lynq-dark": "#0A0A0A",
        "lynq-dark-2": "#0F0F0F",
        "lynq-gray": "#1A1A1A",
        "lynq-gray-2": "#2A2A2A",
        "lynq-gray-3": "#3A3A3A",
      },

      borderRadius: {
        xl: "16px",
      },

      boxShadow: {
        gold: "0 0 12px rgba(212, 175, 55, 0.15)",
        card: "0 0 20px rgba(0,0,0,0.4)",
      },

      keyframes: {
        fadeSlide: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        goldGlow: {
          "0%": { boxShadow: "0 0 0px rgba(212,175,55,0)" },
          "50%": { boxShadow: "0 0 12px rgba(212,175,55,0.4)" },
          "100%": { boxShadow: "0 0 0px rgba(212,175,55,0)" },
        },
      },

      animation: {
        fadeSlide: "fadeSlide 0.45s ease-out",
        goldGlow: "goldGlow 1.2s ease-out",
      },
    },
  },
  plugins: [],
};