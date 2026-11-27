/**
 * Emails for bookings and inquiries. Every mail has an HTML version in the
 * website's style (see email-layout.ts) and a plain-text version.
 *
 * - Melanie gets a notification for every booking and every inquiry.
 *   Reply-To is the visitor, so she can answer straight from her inbox.
 * - The person who booked gets a confirmation in their own language (NL or EN).
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
import {
  button,
  detailsBox,
  esc,
  escLines,
  eyebrow,
  headline,
  layout,
  link,
  logoAttachment,
  paragraph,
  quoteBox,
} from './email-layout';

type Lang = 'nl' | 'en';

const LOCALES: Record<Lang, string> = { nl: 'nl-BE', en: 'en-GB' };

const SESSION_TYPES: Record<Lang, Record<string, string>> = {
  nl: { mindful_yoga: 'Mindful yoga', mindfulness: 'Mindfulnesstraining' },
  en: { mindful_yoga: 'Mindful yoga', mindfulness: 'Mindfulness training' },
};

const INQUIRY_KINDS: Record<string, string> = {
  group_session: 'Aanvraag groepssessie of training',
  talk: 'Aanvraag lezing',
  contact: 'Bericht via de website',
};

const LANGUAGE_NAMES: Record<string, string> = { nl: 'Nederlands', en: 'Engels' };

/** Client-facing texts. No em dashes. */
const CLIENT = {
  nl: {
    subject: (type: string, day: string) => `Je inschrijving: ${type} op ${day}`,
    preheader: (day: string, from: string) => `Je plaats is gereserveerd voor ${day} om ${from}.`,
    eyebrow: 'Bevestiging',
    title: ['Je plaats is', 'gereserveerd.'],
    hello: (name: string) => `Hallo ${name},`,
    intro: 'Fijn dat je erbij bent. Hieronder vind je alles op een rij.',
    session: 'Sessie',
    when: 'Wanneer',
    where: 'Waar',
    places: 'Aantal plaatsen',
    price: 'Prijs',
    perPerson: 'per persoon, te betalen ter plaatse',
    route: 'Routebeschrijving',
    timeRange: (from: string, to: string) => `van ${from} tot ${to}`,
    good: 'Ervaring is niet nodig. Draag makkelijke kleren. Je betaalt ter plaatse.',
    cancel: 'Kan je toch niet komen? Laat het minstens 48 uur op voorhand weten door op deze mail te antwoorden, dan kan iemand anders je plaats krijgen.',
    bye: 'Tot dan!',
    footer: 'Klinisch psycholoog in Gent en Lokeren',
  },
  en: {
    subject: (type: string, day: string) => `Your booking: ${type} on ${day}`,
    preheader: (day: string, from: string) => `Your place is reserved for ${day} at ${from}.`,
    eyebrow: 'Confirmation',
    title: ['Your place is', 'reserved.'],
    hello: (name: string) => `Hi ${name},`,
    intro: 'Glad you’re joining. Here’s everything in one place.',
    session: 'Session',
    when: 'When',
    where: 'Where',
    places: 'Places',
    price: 'Price',
    perPerson: 'per person, paid on the spot',
    route: 'Directions',
    timeRange: (from: string, to: string) => `${from} to ${to}`,
    good: 'No experience needed. Wear comfortable clothes. You pay on the spot.',
    cancel: 'Can’t make it after all? Let me know at least 48 hours in advance by replying to this email, so someone else can have your place.',
    bye: 'See you then,',
    footer: 'Clinical psychologist in Ghent and Lokeren',
  },
} as const;

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

function mapUrl(location: any) {
  if (!location) return '';
  if (location.mapUrl) return location.mapUrl;
  const q = encodeURIComponent(`${location.address}, ${location.postalcode} ${location.city}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function price(value: unknown, lang: Lang) {
  if (value === null || value === undefined || value === '') return '';
  return new Intl.NumberFormat(LOCALES[lang], { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(Number(value));
}

const siteUrl = (lang: string) => `${(process.env.SITE_URL || 'https://melaniebeeckman.be').replace(/\/$/, '')}/${lang}/`;
const siteLabel = () => (process.env.SITE_URL || 'https://melaniebeeckman.be').replace(/^https?:\/\//, '').replace(/\/$/, '');

/** Confirmation for the person who booked. */
function clientConfirmation(lang: Lang, session: any, registration: any) {
  const t = CLIENT[lang] ?? CLIENT.nl;
  const w = when(session.startsAt, session.endsAt, lang);
  const type = SESSION_TYPES[lang][session.type] ?? session.type;
  const loc = session.location;
  const amount = price(session.priceInEuros, lang);
  const name = registration.name;

  const whereHtml = loc
    ? `${esc(loc.name)}<br>${esc(loc.address)}, ${esc(loc.postalcode)} ${esc(loc.city)}<br>${link(mapUrl(loc), t.route)}`
    : '';

  const content = [
    eyebrow(t.eyebrow),
    headline(t.title[0], t.title[1]),
    paragraph(`${esc(t.hello(name))}<br>${t.intro}`),
    detailsBox([
      [t.session, esc(type)],
      [t.when, `${esc(w.day)}<br>${esc(t.timeRange(w.from, w.to))}`],
      [t.where, whereHtml],
      [t.places, String(registration.places)],
      [t.price, amount ? `${esc(amount)} ${t.perPerson}` : ''],
    ]),
    `<div style="height:22px;"></div>`,
    paragraph(t.good),
    paragraph(t.cancel),
    paragraph(`${t.bye}<br>Melanie`, 'margin-bottom:0;'),
  ].join('');

  const footer = `Melanie Beeckman · ${t.footer}<br>${link(siteUrl(lang), siteLabel())}`;

  const text = [
    t.hello(name),
    '',
    t.intro,
    '',
    `${t.session}: ${type}`,
    `${t.when}: ${w.day}, ${t.timeRange(w.from, w.to)}`,
    loc ? `${t.where}: ${place(loc)}` : '',
    loc ? `${t.route}: ${mapUrl(loc)}` : '',
    `${t.places}: ${registration.places}`,
    amount ? `${t.price}: ${amount} ${t.perPerson}` : '',
    '',
    t.good,
    t.cancel,
    '',
    t.bye,
    'Melanie Beeckman',
  ]
    .filter((line, i, all) => line !== '' || all[i - 1] !== '')
    .join('\n');

  return {
    subject: t.subject(type, w.day),
    text,
    html: layout({ lang, preheader: t.preheader(w.day, w.from), content, footer }),
  };
}

export default ({ strapi }: { strapi: Core.Strapi }) => {
  const attachments = () => logoAttachment(strapi.dirs.static.public);

  async function send(message: { to?: string; replyTo?: string; subject: string; text: string; html?: string }) {
    if (!message.to) {
      strapi.log.warn(`[mail] no recipient for "${message.subject}" (is NOTIFY_EMAIL set?)`);
      return;
    }
    if (!process.env.SMTP_HOST) {
      strapi.log.info(`[mail:dev] to=${message.to} replyTo=${message.replyTo ?? '-'}\nSubject: ${message.subject}\n\n${message.text}`);
      return;
    }
    try {
      await strapi.plugin('email').service('email').send({ ...message, attachments: message.html ? attachments() : undefined } as any);
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

  const melanieFooter = (name: string) =>
    `Antwoorden op deze mail gaat rechtstreeks naar ${esc(name)}.<br>Verstuurd door ${link(siteUrl('nl'), siteLabel())}`;

  return {
    async bookingCreated(session: any, registration: any, placesLeft: number) {
      const lang: Lang = registration.language ?? 'nl';
      const w = when(session.startsAt, session.endsAt, 'nl');
      const typeNl = SESSION_TYPES.nl[session.type] ?? session.type;
      const capReached = await clientMailCapReached();
      if (capReached) {
        strapi.log.warn(`[mail] daily limit for client confirmations reached, no confirmation sent to ${registration.email}`);
      }
      const loc = session.location;
      const placesWord = (n: number) => (n === 1 ? 'plaats' : 'plaatsen');
      const capText =
        'Let op: de daglimiet voor bevestigingsmails is bereikt. Deze persoon kreeg geen bevestiging. Veel inschrijvingen op één dag kan op spam wijzen, kijk ze even na.';

      // ---- to Melanie ----
      const html = layout({
        lang: 'nl',
        preheader: `${registration.name} schreef zich in. Nog ${placesLeft} van ${session.capacity} plaatsen vrij.`,
        content: [
          eyebrow('Nieuwe inschrijving'),
          headline(esc(registration.name)),
          paragraph(
            `schreef zich in voor <strong style="font-weight:600;color:#3A1219;">${esc(typeNl)}</strong> op ${esc(w.day)}. ` +
              `Nog <strong style="font-weight:600;color:#6B1E2E;">${placesLeft} van ${session.capacity}</strong> ${placesWord(placesLeft)} vrij.`
          ),
          detailsBox([
            ['Sessie', `${esc(typeNl)}<br>${esc(w.day)}, ${esc(w.from)} tot ${esc(w.to)}`],
            ['Locatie', loc ? `${esc(loc.name)}, ${esc(loc.city)}` : ''],
            ['Plaatsen', `${registration.places} ${placesWord(registration.places)}`],
            ['E-mail', link(`mailto:${registration.email}`, esc(registration.email))],
            ['Telefoon', registration.phone ? link(`tel:${registration.phone.replace(/\s+/g, '')}`, esc(registration.phone)) : ''],
            ['Taal', LANGUAGE_NAMES[lang] ?? lang],
          ]),
          registration.note ? quoteBox('Opmerking', escLines(registration.note)) : '',
          capReached ? `<div style="height:18px;"></div>` + paragraph(esc(capText), 'color:#6B1E2E;margin-bottom:0;') : '',
          button(adminUrl('api::registration.registration'), 'Alle inschrijvingen bekijken'),
        ].join(''),
        footer: melanieFooter(registration.name),
      });

      await send({
        to: notifyTo(),
        replyTo: registration.email,
        subject: `Nieuwe inschrijving: ${typeNl}, ${w.day} (${placesLeft} ${placesWord(placesLeft)} over)`,
        html,
        text: [
          `${registration.name} schreef zich in.`,
          '',
          `Sessie: ${typeNl}, ${w.day}, ${w.from} tot ${w.to}`,
          `Locatie: ${place(loc) || '-'}`,
          `Plaatsen: ${registration.places}`,
          `Nog vrij: ${placesLeft} van ${session.capacity}`,
          '',
          `E-mail: ${registration.email}`,
          `Telefoon: ${registration.phone || '-'}`,
          `Taal: ${LANGUAGE_NAMES[lang] ?? lang}`,
          registration.note ? `\nOpmerking:\n${registration.note}` : '',
          capReached ? `\n${capText}` : '',
          '',
          `Alle inschrijvingen: ${adminUrl('api::registration.registration')}`,
        ].join('\n'),
      });

      if (capReached) return;

      // ---- to the client ----
      const mail = clientConfirmation(lang, session, registration);
      await send({ to: registration.email, replyTo: process.env.MAIL_REPLY_TO || notifyTo(), ...mail });
    },

    async inquiryCreated(inquiry: any) {
      const kind = INQUIRY_KINDS[inquiry.kind] ?? inquiry.kind;
      const who = inquiry.organisation ? `${inquiry.name} (${inquiry.organisation})` : inquiry.name;

      const html = layout({
        lang: 'nl',
        preheader: inquiry.message ? String(inquiry.message).slice(0, 120) : `${kind} van ${who}`,
        content: [
          eyebrow(esc(kind)),
          headline(esc(inquiry.name), inquiry.organisation ? esc(inquiry.organisation) : ''),
          detailsBox([
            ['Onderwerp', esc(inquiry.topic ?? '')],
            ['Gewenste datum', esc(inquiry.preferredDate ?? '')],
            ['Aantal deelnemers', inquiry.participants ? String(inquiry.participants) : ''],
            ['E-mail', link(`mailto:${inquiry.email}`, esc(inquiry.email))],
            ['Telefoon', inquiry.phone ? link(`tel:${String(inquiry.phone).replace(/\s+/g, '')}`, esc(inquiry.phone)) : ''],
            ['Taal', LANGUAGE_NAMES[inquiry.language ?? 'nl'] ?? inquiry.language],
          ]),
          inquiry.message ? quoteBox('Bericht', escLines(inquiry.message)) : '',
          button(adminUrl('api::inquiry.inquiry'), 'Alle berichten bekijken'),
        ].join(''),
        footer: melanieFooter(inquiry.name),
      });

      await send({
        to: notifyTo(),
        replyTo: inquiry.email,
        subject: `${kind}: ${who}`,
        html,
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
          `Taal: ${LANGUAGE_NAMES[inquiry.language ?? 'nl'] ?? inquiry.language}`,
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
