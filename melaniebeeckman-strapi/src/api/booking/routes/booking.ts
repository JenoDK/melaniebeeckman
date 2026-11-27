/**
 * Public routes for the website. No auth: they are protected by validation,
 * a honeypot field, optional Cloudflare Turnstile and a per-IP rate limit.
 */
const limit = (max: number, minutes: number) => ({
  name: 'global::rate-limit',
  config: { max, windowMs: minutes * 60 * 1000 },
});

export default {
  routes: [
    {
      method: 'GET',
      path: '/booking/sessions',
      handler: 'booking.sessions',
      config: { auth: false, middlewares: [limit(120, 1)] },
    },
    {
      method: 'POST',
      path: '/booking/sessions/:documentId/register',
      handler: 'booking.register',
      config: { auth: false, middlewares: [limit(8, 10)] },
    },
    {
      method: 'POST',
      path: '/booking/waitlist',
      handler: 'booking.waitlist',
      config: { auth: false, middlewares: [limit(5, 10)] },
    },
    {
      method: 'POST',
      path: '/booking/inquiries',
      handler: 'booking.inquiry',
      config: { auth: false, middlewares: [limit(5, 10)] },
    },
  ],
};
