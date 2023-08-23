import { type Config } from "tailwindcss";

export default {
  corePlugins: {
    preflight: false,
  },
  content: [
    "./routes/**/*.{tsx,ts}",
    "./islands/**/*.{tsx,ts}",
    "./components/**/*.{tsx,ts}",
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
