/**
 * Emails for bookings and inquiries.
 *
 * - Melanie gets a short notification for every booking and every inquiry.
 *   Reply-To is the visitor, so she can answer straight from her inbox.
 * - The person who booked gets a confirmation in their own language.
 *   Reply-To is Melanie.
 *
 * Without SMTP_HOST (local dev) nothing is sent: the mail is written to the log.
 *
 * Safety cap: at most CLIENT_MAIL_DAILY_LIMIT (default 40) confirmations to clients
 * per day (UTC, same as the Resend quota). If a bot gets past the form checks, it
 * cannot use up the sending quota or hurt the domain's reputation. Above the cap the
 * booking is still saved and Melanie is still notified; only the client mail is skipped.
 */
import type { Core } from '@strapi/strapi';

type Lang = 'nl' | 'en' | 'fr';

const LOCALES: Record<Lang, string> = { nl: 'nl-BE', en: 'en-GB', fr: 'fr-BE' };

const SESSION_TYPES: Record<Lang, Record<string, string>> = {
  nl: { mindful_yoga: 'Mindful yoga', mindfulness: 'Mindfulnesstraining' },
  en: { mindful_yoga: 'Mindful yoga', mindfulness: 'Mindfulness training' },
  fr: { mindful_yoga: 'Yoga en pleine conscience', mindfulness: 'Formation à la pleine conscience' },
};

const INQUIRY_KINDS: Record<string, string> = {
  group_session: 'Groepssessie of training',
  talk: 'Lezing',
  contact: 'Bericht via de website',
};

function when(startsAt: string, endsAt: string, lang: Lang) {
  const locale = LOCALES[lang];
  const tz = 'Europe/Brussels';
  const day = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', timeZone: tz }).format(new Date(startsAt));
  const time = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', timeZone: tz });
  return { day, from: time.format(new Date(startsAt)), to: time.format(new Date(endsAt)) };
}

function place(location: any) {
  if (!location) return '';
  return `${location.name}, ${location.address}, ${location.postalcode} ${location.city}`;
}

function confirmation(lang: Lang, name: string, type: string, day: string, from: string, to: string, where: string, places: number) {
  switch (lang) {
    case 'en':
      return {
        subject: `Your booking: ${type} on ${day}`,
        text: [
          `Hi ${name},`,
          '',
          'Thanks for signing up. Your place is reserved.',
          '',
          type,
          `${day}, ${from} to ${to}`,
          where,
          `Places: ${places}`,
          '',
          'Can’t make it after all? Just reply to this email so someone else can have your place.',
          '',
          'See you then,',
          'Melanie Beeckman',
        ].join('\n'),
      };
    case 'fr':
      return {
        subject: `Votre réservation : ${type}, ${day}`,
        text: [
          `Bonjour ${name},`,
          '',
          'Merci pour votre inscription. Votre place est réservée.',
          '',
          type,
          `${day}, de ${from} à ${to}`,
          where,
          `Nombre de places : ${places}`,
          '',
          'Vous ne pouvez finalement pas venir ? Répondez simplement à cet e-mail, ainsi quelqu’un d’autre pourra prendre votre place.',
          '',
          'À bientôt,',
          'Melanie Beeckman',
        ].join('\n'),
      };
    default:
      return {
        subject: `Je inschrijving: ${type} op ${day}`,
        text: [
          `Hallo ${name},`,
          '',
          'Bedankt voor je inschrijving. Je plaats is gereserveerd.',
          '',
          type,
          `${day}, van ${from} tot ${to}`,
          where,
          `Aantal plaatsen: ${places}`,
          '',
          'Kan je toch niet komen? Antwoord dan gewoon op deze mail, dan kan iemand anders je plaats krijgen.',
          '',
          'Tot dan!',
          'Melanie Beeckman',
        ].join('\n'),
      };
  }
}

export default ({ strapi }: { strapi: Core.Strapi }) => {
  async function send(message: { to?: string; replyTo?: string; subject: string; text: string }) {
    if (!message.to) {
      strapi.log.warn(`[mail] no recipient for "${message.subject}" (is NOTIFY_EMAIL set?)`);
      return;
    }
    if (!process.env.SMTP_HOST) {
      strapi.log.info(`[mail:dev] to=${message.to} replyTo=${message.replyTo ?? '-'}\nSubject: ${message.subject}\n\n${message.text}`);
      return;
    }
    try {
      await strapi.plugin('email').service('email').send(message);
    } catch (err: any) {
      // Never fail a booking because of email. Melanie still sees it in the admin.
      strapi.log.error(`[mail] sending "${message.subject}" to ${message.to} failed: ${err?.message ?? err}`);
    }
  }

  const notifyTo = () => process.env.NOTIFY_EMAIL;

  /** True when today's bookings (this one included) are above the daily cap. */
  async function clientMailCapReached() {
    const limit = Number(process.env.CLIENT_MAIL_DAILY_LIMIT ?? 40);
    if (!Number.isFinite(limit) || limit <= 0) return false;
    const since = new Date();
    since.setUTCHours(0, 0, 0, 0);
    const today = await strapi.db
      .query('api::registration.registration' as any)
      .count({ where: { createdAt: { $gte: since.toISOString() } } });
    return today > limit;
  }
  const adminUrl = (uid: string) => {
    const admin =
      (strapi.config.get('admin.absoluteUrl') as string) ||
      `${((strapi.config.get('server.absoluteUrl') as string) || 'http://localhost:1337').replace(/\/$/, '')}/admin`;
    return `${admin.replace(/\/$/, '')}/content-manager/collection-types/${uid}`;
  };

  return {
    async bookingCreated(session: any, registration: any, placesLeft: number) {
      const lang: Lang = registration.language ?? 'nl';
      const forMelanie = when(session.startsAt, session.endsAt, 'nl');
      const typeNl = SESSION_TYPES.nl[session.type] ?? session.type;
      const capReached = await clientMailCapReached();
      if (capReached) {
        strapi.log.warn(`[mail] daily limit for client confirmations reached, no confirmation sent to ${registration.email}`);
      }

      await send({
        to: notifyTo(),
        replyTo: registration.email,
        subject: `Nieuwe inschrijving: ${typeNl}, ${forMelanie.day} (${placesLeft} ${placesLeft === 1 ? 'plaats' : 'plaatsen'} over)`,
        text: [
          `${registration.name} schreef zich in.`,
          '',
          `Sessie: ${typeNl}, ${forMelanie.day}, ${forMelanie.from} tot ${forMelanie.to}`,
          `Locatie: ${place(session.location) || '-'}`,
          `Plaatsen: ${registration.places}`,
          `Nog vrij: ${placesLeft} van ${session.capacity}`,
          '',
          `E-mail: ${registration.email}`,
          `Telefoon: ${registration.phone || '-'}`,
          `Taal: ${lang.toUpperCase()}`,
          registration.note ? `\nOpmerking:\n${registration.note}` : '',
          capReached
            ? '\nLet op: de daglimiet voor bevestigingsmails is bereikt. Deze persoon kreeg geen bevestiging. Veel inschrijvingen op één dag kan op spam wijzen, kijk ze even na.'
            : '',
          '',
          `Alle inschrijvingen: ${adminUrl('api::registration.registration')}`,
        ].join('\n'),
      });

      if (capReached) return;

      const forClient = when(session.startsAt, session.endsAt, lang);
      const type = SESSION_TYPES[lang][session.type] ?? session.type;
      const mailBody = confirmation(lang, registration.name, type, forClient.day, forClient.from, forClient.to, place(session.location), registration.places);
      await send({ to: registration.email, replyTo: process.env.MAIL_REPLY_TO || notifyTo(), ...mailBody });
    },

    async inquiryCreated(inquiry: any) {
      const kind = INQUIRY_KINDS[inquiry.kind] ?? inquiry.kind;
      const who = inquiry.organisation ? `${inquiry.name} (${inquiry.organisation})` : inquiry.name;
      await send({
        to: notifyTo(),
        replyTo: inquiry.email,
        subject: `${kind}: ${who}`,
        text: [
          `${kind} via de website.`,
          '',
          `Naam: ${inquiry.name}`,
          `Organisatie: ${inquiry.organisation || '-'}`,
          `E-mail: ${inquiry.email}`,
          `Telefoon: ${inquiry.phone || '-'}`,
          inquiry.topic ? `Onderwerp: ${inquiry.topic}` : '',
          inquiry.preferredDate ? `Gewenste datum: ${inquiry.preferredDate}` : '',
          inquiry.participants ? `Aantal deelnemers: ${inquiry.participants}` : '',
          `Taal: ${(inquiry.language ?? 'nl').toUpperCase()}`,
          inquiry.message ? `\nBericht:\n${inquiry.message}` : '',
          '',
          'Antwoorden kan rechtstreeks op deze mail.',
          `Alle berichten: ${adminUrl('api::inquiry.inquiry')}`,
        ]
          .filter((line) => line !== '')
          .join('\n'),
      });
    },
  };
};
