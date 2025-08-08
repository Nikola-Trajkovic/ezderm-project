import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}", // tvoja aplikacija
    "./components/**/*.{ts,tsx,js,jsx}", // tvoji komponenti
    "./node_modules/@shadcn/ui/**/*.{ts,tsx,js,jsx}", // ako shadcn zahteva
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
