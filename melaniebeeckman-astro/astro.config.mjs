// @ts-check
import {defineConfig} from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import icon from "astro-icon";
import {defaultLang, languages} from "./src/i18n/languages.js";

// https://astro.build/config
export default defineConfig({
  i18n: {
    locales: Object.keys(languages),
    defaultLocale: defaultLang,
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false
    }
  },
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [react(), icon()],
  build: {
    format: 'directory'
  }
});