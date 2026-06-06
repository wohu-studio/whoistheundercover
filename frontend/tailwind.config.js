/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#e040fb",
        "primary-container": "#7c4dff",
        "on-primary": "#ffffff",
        "on-primary-container": "#e8d5ff",
        secondary: "#00e5ff",
        "secondary-container": "#0091ea",
        "on-secondary": "#000000",
        tertiary: "#76ff03",
        "on-tertiary": "#000000",
        error: "#ff1744",
        "error-container": "#b71c1c",
        "on-error": "#ffffff",
        surface: "#0a0a1a",
        "surface-dim": "#06060f",
        "surface-container-low": "#111128",
        "surface-container": "#161636",
        "surface-container-high": "#1e1e44",
        "surface-container-highest": "#262652",
        "on-surface": "#e8e6f0",
        "on-surface-variant": "#9d9bb0",
        outline: "#5c5a72",
        "outline-variant": "#2e2d4a",
        warning: "#ffab00",
        "warning-container": "#332200",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      },
      backgroundImage: {
        "primary-gradient": "linear-gradient(135deg, #e040fb, #7c4dff, #00e5ff)",
        "surface-gradient": "linear-gradient(180deg, #0a0a1a 0%, #0d0d2b 50%, #020617 100%)",
      },
      boxShadow: {
        "neon-pink": "0 0 12px rgba(224, 64, 251, 0.4), 0 0 30px rgba(224, 64, 251, 0.15)",
        "neon-cyan": "0 0 12px rgba(0, 229, 255, 0.4), 0 0 30px rgba(0, 229, 255, 0.15)",
        "neon-green": "0 0 12px rgba(118, 255, 3, 0.4), 0 0 30px rgba(118, 255, 3, 0.15)",
        "glow": "0 0 20px rgba(124, 77, 255, 0.3), 0 0 60px rgba(124, 77, 255, 0.1)",
      },
    },
  },
  plugins: [],
};
