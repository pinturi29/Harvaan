import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        harvest: {
          green: {
            50:  "#f0f7f2",
            100: "#d9edd e",
            200: "#b2d9bc",
            300: "#7bbc8c",
            400: "#4a9e62",
            500: "#2e7d32",
            600: "#1a5c2e",
            700: "#144824",
            800: "#0f3419",
            900: "#0a2310",
          },
          gold: "#b8860b",
          amber: "#d4a017",
          cream: "#fdf6e3",
          brown: "#5d4037",
          soil:  "#6d4c41",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
