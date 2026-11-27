/**
 * Public booking endpoints. Only these routes are exposed; registrations,
 * waitlist entries and inquiries can never be read through the API.
 */
import type { Core } from '@strapi/strapi';
import { BookingError, isBot } from '../services/booking';

function clientIp(ctx: any): string | undefined {
  const forwarded = ctx.get('x-forwarded-for');
  return (forwarded ? forwarded.split(',')[0].trim() : ctx.request.ip) || undefined;
}

export default ({ strapi }: { strapi: Core.Strapi }) => {
  const booking = () => strapi.service('api::booking.booking') as any;

  async function run(ctx: any, fn: () => Promise<unknown>) {
    try {
      ctx.body = await fn();
    } catch (err: any) {
      if (err instanceof BookingError) {
        ctx.status = err.status;
        ctx.body = { error: { code: err.code, ...err.details } };
        return;
      }
      strapi.log.error(`[booking] ${err?.stack ?? err}`);
      ctx.status = 500;
      ctx.body = { error: { code: 'server_error' } };
    }
  }

  return {
    async sessions(ctx: any) {
      ctx.set('Cache-Control', 'no-store');
      await run(ctx, () => booking().listSessions());
    },

    async register(ctx: any) {
      const body = ctx.request.body ?? {};
      // Bots get a normal-looking answer, nothing is saved.
      if (isBot(body)) return run(ctx, async () => ({ placesLeft: null, places: 0 }));
      await run(ctx, () => booking().register(ctx.params.documentId, body, clientIp(ctx)));
    },

    async waitlist(ctx: any) {
      const body = ctx.request.body ?? {};
      if (isBot(body)) return run(ctx, async () => ({ ok: true }));
      await run(ctx, () => booking().joinWaitlist(body, clientIp(ctx)));
    },

    async inquiry(ctx: any) {
      const body = ctx.request.body ?? {};
      if (isBot(body)) return run(ctx, async () => ({ ok: true }));
      await run(ctx, () => booking().createInquiry(body, clientIp(ctx)));
    },
  };
};
