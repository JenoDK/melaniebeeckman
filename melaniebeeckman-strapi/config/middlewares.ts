export default ({ env }) => [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    // Only the website may call the booking API from a browser.
    name: 'strapi::cors',
    config: {
      origin: env.array('CORS_ORIGINS', [
        'http://localhost:4321',
        'https://melaniebeeckman.be',
        'https://www.melaniebeeckman.be',
      ]),
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
