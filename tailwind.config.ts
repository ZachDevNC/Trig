import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "-apple-system",
          "BlinkMacSystemFont",
          "Inter",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        ink: "#111111",
        bone: "#faf7f2",
        accent: {
          DEFAULT: "#f4691c",
          50:  "#fff5ee",
          100: "#ffe6d3",
          200: "#fcc9a3",
          500: "#f4691c",
          600: "#dc5a13",
          700: "#b6480e",
        },
      },
      letterSpacing: {
        tightish: "-0.01em",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
      boxShadow: {
        card: "0 1px 0 rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [],
} satisfies Config;
