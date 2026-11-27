/** Fixed practice details. Change here when something changes. */
export const site = {
  url: 'https://melaniebeeckman.be',
  rosa: 'https://rosa.be/nl/hp/melanie-beeckman/',
  elp: 'https://www.eerstelijnszone.be/eerstelijnspsychologische-zorg-elp-1',
  phone: '+32456240454',
  phoneLabel: '+32 456 24 04 54',
  email: 'psycholoog.melanie@gmail.com',
  riziv: '70184844000',
};

export const locations = [
  {
    city: { nl: 'Gent', en: 'Ghent', fr: 'Gand' },
    name: 'Huisartsenpraktijk De Bijloke',
    street: 'Maurice De Weertstraat 2',
    postal: '9000',
    maps: 'https://www.google.com/maps/search/?api=1&query=Maurice+De+Weertstraat+2+9000+Gent',
  },
  {
    city: { nl: 'Lokeren', en: 'Lokeren', fr: 'Lokeren' },
    name: 'Praktijk 50',
    street: 'Koophandelstraat 40',
    postal: '9160',
    maps: 'https://www.google.com/maps/search/?api=1&query=Koophandelstraat+40+9160+Lokeren',
  },
] as const;

/** Strapi, called from the browser for live availability and the forms. */
export const strapiUrl = (import.meta.env.PUBLIC_STRAPI_URL ?? 'http://localhost:1337').replace(/\/$/, '');
export const turnstileSiteKey: string = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? '';
