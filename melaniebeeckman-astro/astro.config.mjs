// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://melaniebeeckman.be',
  i18n: {
    locales: ['nl', 'en', 'fr'],
    defaultLocale: 'nl',
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  build: { format: 'directory' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
