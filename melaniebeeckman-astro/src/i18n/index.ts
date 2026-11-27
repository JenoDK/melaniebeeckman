import base from './base';
import extra from './extra';

export const languages = { nl: 'Nederlands', en: 'English', fr: 'Français' } as const;
export type Lang = keyof typeof languages;
export const langs = Object.keys(languages) as Lang[];
export const defaultLang: Lang = 'nl';

/** Locale used for dates and prices. */
export const locales: Record<Lang, string> = { nl: 'nl-BE', en: 'en-GB', fr: 'fr-BE' };

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (langs as string[]).includes(value);
}

export function t(lang: Lang) {
  return { ...base[lang], ...extra[lang], ui: { ...base[lang].ui, ...extra[lang].ui } };
}
export type Copy = ReturnType<typeof t>;

/** getStaticPaths helper for pages under src/pages/[lang]. */
export function langPaths() {
  return langs.map((lang) => ({ params: { lang } }));
}

/** Page keys and their URL slug (same slug in every language). */
export const pages = {
  home: '',
  about: 'about',
  services: 'services',
  sessions: 'sessions',
  orgs: 'organisations',
  faq: 'faq',
  contact: 'contact',
} as const;
export type PageKey = keyof typeof pages;

export function href(lang: Lang, page: PageKey, hash = '') {
  const slug = pages[page];
  return `/${lang}/${slug ? slug + '/' : ''}${hash}`;
}
