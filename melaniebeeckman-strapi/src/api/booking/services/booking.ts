/**
 * Booking logic for mindfulness / mindful yoga sessions, the waitlist and inquiries.
 *
 * Places left are never stored on the session itself: sessions use draft & publish,
 * and publishing copies the draft over the published version, which would reset a
 * counter. Places left = capacity minus the places of all confirmed registrations.
 */
import type { Core } from '@strapi/strapi';

const SESSION = 'api::session.session';
const REGISTRATION = 'api::registration.registration';
const WAITLIST = 'api::waitlist-entry.waitlist-entry';
const INQUIRY = 'api::inquiry.inquiry';
const SETTINGS = 'api::booking-setting.booking-setting';

const LANGUAGES = ['nl', 'en', 'fr'] as const;
const INQUIRY_KINDS = ['group_session', 'talk', 'contact'] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class BookingError extends Error {
  constructor(
    public code: string,
    public status = 400,
    public details: Record<string, unknown> = {}
  ) {
    super(code);
  }
}

/** Trimmed string or undefined. Throws when longer than max. */
function text(value: unknown, field: string, max: number, required = false): string | undefined {
  if (value === undefined || value === null || value === '') {
    if (required) throw new BookingError('missing_field', 400, { field });
    return undefined;
  }
  if (typeof value !== 'string') throw new BookingError('invalid_field', 400, { field });
  const trimmed = value.trim();
  if (required && !trimmed) throw new BookingError('missing_field', 400, { field });
  if (trimmed.length > max) throw new BookingError('field_too_long', 400, { field, max });
  return trimmed || undefined;
}

/**
 * Names end up in emails, so spammers like to put links or HTML in them.
 * Real names never contain these.
 */
const NOT_A_NAME = /https?:|www\.|[<>]|\.(com|net|org|ru|xyz|io|info|biz|top)\b/i;

function personName(value: unknown): string {
  const v = text(value, 'name', 120, true)!;
  if (NOT_A_NAME.test(v)) throw new BookingError('invalid_name', 400, { field: 'name' });
  return v;
}

function email(value: unknown): string {
  const v = text(value, 'email', 254, true)!;
  if (!EMAIL_RE.test(v)) throw new BookingError('invalid_email', 400, { field: 'email' });
  return v.toLowerCase();
}

function language(value: unknown): (typeof LANGUAGES)[number] {
  return (LANGUAGES as readonly string[]).includes(value as string) ? (value as any) : 'nl';
}

/** Honeypot: bots fill in every field, people never see this one. */
export function isBot(body: any): boolean {
  return typeof body?.website === 'string' && body.website.trim() !== '';
}

async function verifyTurnstile(token: unknown, ip?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return; // not configured (local dev): skip
  if (typeof token !== 'string' || !token) throw new BookingError('captcha_required', 400);
  const form = new URLSearchParams({ secret, response: token });
  if (ip) form.set('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
  const data: any = await res.json().catch(() => ({}));
  if (!data.success) throw new BookingError('captcha_failed', 400);
}

export default ({ strapi }: { strapi: Core.Strapi }) => {
  const mail = () => strapi.service('api::booking.mail') as any;

  async function settings() {
    const s: any = await strapi.documents(SETTINGS as any).findFirst();
    return {
      registrationsOpen: s?.registrationsOpen ?? true,
      maxPlacesPerBooking: s?.maxPlacesPerBooking ?? 3,
    };
  }

  /** Confirmed places per session documentId. */
  async function bookedPlaces(documentIds: string[]): Promise<Record<string, number>> {
    if (documentIds.length === 0) return {};
    const rows: any[] = await strapi.db.query(REGISTRATION as any).findMany({
      where: { sessionDocumentId: { $in: documentIds }, bookingStatus: 'confirmed' },
      select: ['sessionDocumentId', 'places'],
    });
    const totals: Record<string, number> = {};
    for (const r of rows) totals[r.sessionDocumentId] = (totals[r.sessionDocumentId] ?? 0) + (r.places ?? 0);
    return totals;
  }

  function publicSession(s: any, booked: number, open: boolean) {
    const placesLeft = Math.max(0, s.capacity - booked);
    return {
      documentId: s.documentId,
      type: s.type,
      startsAt: s.startsAt,
      endsAt: s.endsAt,
      priceInEuros: s.priceInEuros ?? null,
      capacity: s.capacity,
      placesLeft,
      bookable: open && s.bookingOpen && placesLeft > 0,
      location: s.location
        ? {
            name: s.location.name,
            address: s.location.address,
            postalcode: s.location.postalcode,
            city: s.location.city,
            mapUrl: s.location.mapUrl ?? null,
          }
        : null,
    };
  }

  return {
    /** Upcoming published sessions with live availability. */
    async listSessions() {
      const cfg = await settings();
      const sessions: any[] = await strapi.documents(SESSION as any).findMany({
        status: 'published',
        filters: { startsAt: { $gt: new Date().toISOString() } },
        sort: 'startsAt:asc',
        populate: { location: true },
      } as any);
      const booked = await bookedPlaces(sessions.map((s) => s.documentId));
      return {
        registrationsOpen: cfg.registrationsOpen,
        maxPlacesPerBooking: cfg.maxPlacesPerBooking,
        sessions: sessions.map((s) => publicSession(s, booked[s.documentId] ?? 0, cfg.registrationsOpen)),
      };
    },

    /** Book places in a session. Checks capacity inside a locked transaction. */
    async register(documentId: string, body: any, ip?: string) {
      await verifyTurnstile(body?.turnstileToken, ip);
      const cfg = await settings();
      if (!cfg.registrationsOpen) throw new BookingError('registrations_closed', 409);

      const input = {
        name: personName(body?.name),
        email: email(body?.email),
        phone: text(body?.phone, 'phone', 40),
        note: text(body?.note, 'note', 1000),
        language: language(body?.language),
        places: Number(body?.places ?? 1),
      };
      if (!Number.isInteger(input.places) || input.places < 1 || input.places > cfg.maxPlacesPerBooking) {
        throw new BookingError('invalid_places', 400, { max: cfg.maxPlacesPerBooking });
      }

      const isPostgres = strapi.config.get('database.connection.client') === 'postgres';

      const result = await strapi.db.transaction(async ({ trx }: any) => {
        // Lock the published session row so two simultaneous bookings for the
        // last place are handled one after the other. SQLite (local dev) only
        // allows one writer at a time, so it needs no lock.
        if (isPostgres) {
          await strapi.db
            .connection('sessions')
            .transacting(trx)
            .select('id')
            .where('document_id', documentId)
            .whereNotNull('published_at')
            .forUpdate();
        }

        const session: any = await strapi.documents(SESSION as any).findOne({
          documentId,
          status: 'published',
          populate: { location: true },
        } as any);

        if (!session) throw new BookingError('session_not_found', 404);
        if (!session.bookingOpen) throw new BookingError('session_closed', 409);
        if (new Date(session.startsAt).getTime() <= Date.now()) throw new BookingError('session_started', 409);

        const booked = (await bookedPlaces([documentId]))[documentId] ?? 0;
        const left = session.capacity - booked;
        if (input.places > left) throw new BookingError('not_enough_places', 409, { placesLeft: Math.max(0, left) });

        const registration = await strapi.documents(REGISTRATION as any).create({
          data: {
            session: documentId,
            sessionDocumentId: documentId,
            name: input.name,
            email: input.email,
            phone: input.phone,
            note: input.note,
            places: input.places,
            language: input.language,
            bookingStatus: 'confirmed',
          },
        } as any);

        return { registration, session, placesLeft: left - input.places };
      });

      // Emails go out after the booking is saved. A mail problem never undoes a booking.
      await mail().bookingCreated(result.session, result.registration, result.placesLeft);

      return { placesLeft: result.placesLeft, places: input.places };
    },

    /** "Keep me posted" when no sessions are planned. */
    async joinWaitlist(body: any, ip?: string) {
      await verifyTurnstile(body?.turnstileToken, ip);
      const address = email(body?.email);
      const existing = await strapi.db.query(WAITLIST as any).findOne({ where: { email: address, notified: false } });
      if (!existing) {
        await strapi.documents(WAITLIST as any).create({ data: { email: address, language: language(body?.language) } } as any);
      }
      return { ok: true };
    },

    /** Organisation requests (group session or talk) and general contact messages. */
    async createInquiry(body: any, ip?: string) {
      await verifyTurnstile(body?.turnstileToken, ip);
      const kind = body?.kind;
      if (!(INQUIRY_KINDS as readonly string[]).includes(kind)) throw new BookingError('invalid_kind', 400);

      const participantsRaw = body?.participants;
      const participants =
        participantsRaw === undefined || participantsRaw === null || participantsRaw === '' ? undefined : Number(participantsRaw);
      if (participants !== undefined && (!Number.isInteger(participants) || participants < 1 || participants > 10000)) {
        throw new BookingError('invalid_participants', 400);
      }

      const data = {
        kind,
        topic: text(body?.topic, 'topic', 120),
        organisation: text(body?.organisation, 'organisation', 160),
        name: personName(body?.name),
        email: email(body?.email),
        phone: text(body?.phone, 'phone', 40),
        preferredDate: text(body?.preferredDate, 'preferredDate', 120),
        participants,
        message: text(body?.message, 'message', 3000, kind === 'contact'),
        language: language(body?.language),
      };

      const inquiry = await strapi.documents(INQUIRY as any).create({ data } as any);
      await mail().inquiryCreated(inquiry);
      return { ok: true };
    },
  };
};
