import { type Config } from "tailwindcss";
// import * as tailwindAnimate from "tailwindcss-animate";

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
  plugins: [], // tailwindAnimate
} satisfies Config;
