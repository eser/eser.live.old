import { type Config } from "tailwindcss";

export default {
  content: [
    "./routes/**/*.{tsx,ts}",
    "./islands/**/*.{tsx,ts}",
    "./components/**/*.{tsx,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
