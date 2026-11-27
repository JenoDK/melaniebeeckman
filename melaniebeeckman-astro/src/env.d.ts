/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Public URL of Strapi, called from the browser (booking tool and forms). */
  readonly PUBLIC_STRAPI_URL?: string;
  /** Cloudflare Turnstile site key. Leave empty to skip the bot check (local dev). */
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
