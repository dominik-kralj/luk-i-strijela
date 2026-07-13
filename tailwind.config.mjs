/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        soil: '#2B2116',
        parchment: '#F1ECD8',
        field: '#34492E',
        'onion-skin': '#C97C3D',
        arrow: '#8B3A2B',
        sprout: '#8FA274',
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'serif'],
        body: ['Karla', 'ui-sans-serif', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
