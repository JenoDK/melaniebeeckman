/**
 * Talking to the Strapi booking API from the browser, plus optional
 * Cloudflare Turnstile. Turnstile is only loaded when PUBLIC_TURNSTILE_SITE_KEY is set.
 */
import { strapiUrl, turnstileSiteKey } from '@lib/site';

export type ApiError = { code: string; status: number; placesLeft?: number; field?: string };

export async function api<T = any>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${strapiUrl}/api/booking${path}`, {
      method: init?.method ?? 'GET',
      headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
      body: init?.body ? JSON.stringify(init.body) : undefined,
    });
  } catch {
    throw { code: 'network', status: 0 } satisfies ApiError;
  }
  const data: any = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, code: data?.error?.code ?? 'server_error', ...data?.error } as ApiError;
  return data as T;
}

type ErrorTexts = {
  generic: string; full: string; notEnough: string; closed: string; email: string;
  name: string; missing: string; tooMany: string; captcha: string;
};

/** Human message for an API error. */
export function errorText(err: unknown, texts: ErrorTexts): string {
  const e = err as ApiError;
  switch (e?.code) {
    case 'not_enough_places':
      return e.placesLeft ? texts.notEnough.replace('{n}', String(e.placesLeft)) : texts.full;
    case 'session_closed':
    case 'session_started':
    case 'registrations_closed':
    case 'session_not_found':
      return texts.closed;
    case 'invalid_email':
      return texts.email;
    case 'invalid_name':
      return texts.name;
    case 'missing_field':
      return texts.missing;
    case 'too_many_requests':
      return texts.tooMany;
    case 'captcha_required':
    case 'captcha_failed':
      return texts.captcha;
    default:
      return texts.generic;
  }
}

/* ---------- Turnstile ---------- */
declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      getResponse: (id: string) => string | undefined;
      reset: (id: string) => void;
    };
  }
}

let loading: Promise<void> | null = null;
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('turnstile'));
    document.head.appendChild(s);
  });
  return loading;
}

/**
 * Adds a Turnstile widget to the form (in its .captcha slot) when configured.
 * Returns a function that gives the token for the next submit.
 */
export function protect(form: HTMLFormElement, lang: string) {
  const slot = form.querySelector<HTMLElement>('.captcha');
  if (!turnstileSiteKey || !slot) return { token: () => undefined as string | undefined, reset: () => {} };
  let id: string | undefined;
  loadTurnstile()
    .then(() => {
      if (!slot.isConnected) return;
      id = window.turnstile!.render(slot, { sitekey: turnstileSiteKey, language: lang, theme: 'light', appearance: 'interaction-only' });
    })
    .catch(() => {});
  return {
    token: () => (id ? window.turnstile!.getResponse(id) : undefined),
    reset: () => id && window.turnstile!.reset(id),
  };
}

/** Collects named form fields into a plain object (strings, trimmed). */
export function formValues(form: HTMLFormElement): Record<string, string> {
  const out: Record<string, string> = {};
  new FormData(form).forEach((v, k) => {
    if (typeof v === 'string') out[k] = v.trim();
  });
  return out;
}

export function setBusy(button: HTMLButtonElement | null, busy: boolean, busyText?: string) {
  if (!button) return;
  if (busy) {
    button.dataset.label ??= button.textContent ?? '';
    button.disabled = true;
    if (busyText) button.textContent = busyText;
  } else {
    button.disabled = false;
    if (button.dataset.label) button.textContent = button.dataset.label;
  }
}
