import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  // Add your GitHub Pages URL and Repository subpath:
  site: 'https://miraitee.github.io',
  base: '/FA-CacheSim', // Must match your repository name exactly (case-sensitive!)
  integrations: [react()],
});