import { api } from './api';

export type Session = {
  documentId: string;
  type: 'mindful_yoga' | 'mindfulness';
  startsAt: string;
  endsAt: string;
  priceInEuros: number | string | null;
  capacity: number;
  placesLeft: number;
  bookable: boolean;
  location: { name: string; address: string; postalcode: string; city: string; mapUrl: string | null } | null;
};
export type SessionList = { registrationsOpen: boolean; maxPlacesPerBooking: number; sessions: Session[] };

const LOCALES: Record<string, string> = { nl: 'nl-BE', en: 'en-GB', fr: 'fr-BE' };
const TZ = 'Europe/Brussels';

/** Shared between components on the same page; a fresh request after 2 seconds. */
let cache: { at: number; promise: Promise<SessionList> } | null = null;
export function loadSessions(): Promise<SessionList> {
  if (cache && Date.now() - cache.at < 2000) return cache.promise;
  const promise = api<SessionList>('/sessions');
  cache = { at: Date.now(), promise };
  promise.catch(() => (cache = null));
  return promise;
}

export function fmt(lang: string) {
  const locale = LOCALES[lang] ?? 'nl-BE';
  const part = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, { timeZone: TZ, ...opts });
  const day = part({ day: 'numeric' });
  const month = part({ month: 'long' });
  const weekday = part({ weekday: 'long' });
  const time = part({ hour: '2-digit', minute: '2-digit' });
  const full = part({ weekday: 'long', day: 'numeric', month: 'long' });
  const money = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 2, minimumFractionDigits: 0 });
  return {
    day: (iso: string) => day.format(new Date(iso)),
    month: (iso: string) => month.format(new Date(iso)),
    weekday: (iso: string) => weekday.format(new Date(iso)),
    time: (s: Session) => `${time.format(new Date(s.startsAt))} - ${time.format(new Date(s.endsAt))}`,
    full: (iso: string) => full.format(new Date(iso)),
    price: (value: Session['priceInEuros']) => (value === null || value === '' ? null : money.format(Number(value))),
  };
}

/** "januari en februari 2027", or "december 2026 en januari 2027" across years. */
export function periodLabel(sessions: Session[], lang: string): string {
  const locale = LOCALES[lang] ?? 'nl-BE';
  const monthYear = new Intl.DateTimeFormat(locale, { timeZone: TZ, month: 'long', year: 'numeric' });
  const monthOnly = new Intl.DateTimeFormat(locale, { timeZone: TZ, month: 'long' });
  const year = new Intl.DateTimeFormat(locale, { timeZone: TZ, year: 'numeric' });
  const seen = new Map<string, Date>();
  for (const s of sessions) {
    const d = new Date(s.startsAt);
    seen.set(monthYear.format(d), d);
  }
  const dates = [...seen.values()];
  if (dates.length === 0) return '';
  const list = new Intl.ListFormat(locale, { type: 'conjunction' });
  const years = new Set(dates.map((d) => year.format(d)));
  if (years.size === 1) {
    return `${list.format(dates.map((d) => monthOnly.format(d)))} ${[...years][0]}`;
  }
  return list.format(dates.map((d) => monthYear.format(d)));
}
