import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        leader: "#f59e0b",
        sensitive: "#ec4899",
        unique: "#8b5cf6",
        hermit: "#06b6d4",
      },
    },
  },
  plugins: [],
} satisfies Config;
