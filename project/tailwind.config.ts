import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        blue: {
          '50':  '#f6f9fb',
          '100': '#e1f1fc',
          '200': '#bfdcfa',
          '300': '#92baf1',
          '400': '#6794e5',
          '500': '#1042C2',
          '600': '#4253cb',
          '700': '#333ea8',
          '800': '#242a7b',
          '900': '#141a4d',
        },
        gray: {
          '50':  '#f8f9f9',
          '100': '#eef0f5',
          '200': '#d9dce9',
          '300': '#b4b9cf',
          '400': '#8991ad',
          '500': '#6d6f8e',
          '600': '#585470',
          '700': '#433f54',
          '800': '#2e2b3a',
          '900': '#1b1a24',
        },
      },
    },
  },
  plugins: [],
};
export default config;
