import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://luk-i-strijela.kraljdominik97.workers.dev',
  integrations: [tailwind({ applyBaseStyles: false })],
});
