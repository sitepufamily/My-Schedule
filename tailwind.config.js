/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#10121C",
          soft: "#171A28",
          line: "#262A3D",
        },
        paper: "#F6F3EC",
        indigo: {
          DEFAULT: "#5B5FEF",
          soft: "#8B8EF5",
        },
        amber: "#F2B84B",
        teal: "#2FCBA3",
        rose: "#FB7185",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["'Plus Jakarta Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(91,95,239,0.45)",
      },
    },
  },
  plugins: [],
};
