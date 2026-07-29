/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#123A5E",
          light: "#1F6098",
          dark: "#0A2440",
        },
        gold: {
          DEFAULT: "#E8A33D",
          light: "#F2C572",
          dark: "#C4832A",
        },
        rust: {
          DEFAULT: "#C1502E",
          light: "#DA6B47",
          dark: "#9C3E22",
        },
        sky: {
          DEFAULT: "#2E9BD6",
          light: "#6EC1E8",
        },
        ivory: "#FBF8F3",
        ink: "#22281F",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      backgroundImage: {
        "grain": "radial-gradient(circle at 1px 1px, rgba(27,67,50,0.06) 1px, transparent 0)",
      },
      boxShadow: {
        card: "0 4px 24px -4px rgba(27,67,50,0.15)",
      },
    },
  },
  plugins: [],
};
