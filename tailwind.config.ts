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
        cyan: {
          '50':  '#f8f9fa',
          '100': '#ebf0f9',
          '200': '#d3dcf2',
          '300': '#acb9df',
          '400': '#8391c7',
          '500': '#686db0',
          '600': '#545294',
          '700': '#403d72',
          '800': '#2c2a4f',
          '900': '#1a1a30',
        },
    },
    keyframes: {
      pulse: {
        '0%, 100%': {
          transform: 'scale(1)',
          opacity: '1',           // volledig zichtbaar
        },
        '50%': {
          transform: 'scale(1.05)', 
          opacity: '0.8',         // iets doorzichtiger (90% zichtbaarheid)
        },
      },
    },
    animation: {
      pulse: 'pulse 3s infinite ease-in-out',
    },

    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
  
};
export default config;