/**
 * HTML layout for all emails, in the style of the website (E2: pink and sand,
 * burgundy accents). Table based with inline styles, because that is what
 * email clients understand. Web fonts are not loaded (privacy, and most clients
 * ignore them); Georgia stands in for Cormorant Garamond.
 *
 * The logo is attached inline (cid), so it shows without loading anything external.
 */
import fs from 'node:fs';
import path from 'node:path';

export const LOGO_CID = 'logo@melaniebeeckman.be';

const C = {
  page: '#F7F0E8',
  paper: '#FFFBF7',
  sand: '#EDE3D6',
  pink: '#F6E3E2',
  line: '#E3D3C3',
  wine: '#6B1E2E',
  ink: '#3A1219',
  ink2: '#5E3139',
  ink3: '#8A4E58',
  tan: '#C8A995',
};
const SERIF = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
const SANS = "'Jost', 'Helvetica Neue', Helvetica, Arial, sans-serif";

/** Escape anything that came from a visitor. */
export function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Escaped text with line breaks kept. */
export function escLines(value: unknown): string {
  return esc(value).replace(/\r?\n/g, '<br>');
}

export function logoAttachment(publicDir: string) {
  const file = path.join(publicDir, 'email', 'logo.png');
  if (!fs.existsSync(file)) return [];
  return [{ filename: 'logo.png', path: file, cid: LOGO_CID, contentDisposition: 'inline' as const }];
}

/** Key/value rows inside a soft pink box. Values must already be escaped. */
export function detailsBox(rows: [string, string][]): string {
  const body = rows
    .filter(([, v]) => v)
    .map(
      ([k, v], i) => `
      <tr>
        <td style="padding:${i === 0 ? '0' : '14px'} 0 0;font-family:${SANS};font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:${C.ink3};">${k}</td>
      </tr>
      <tr>
        <td style="padding:4px 0 0;font-family:${SANS};font-size:16px;line-height:1.5;color:${C.ink};">${v}</td>
      </tr>`
    )
    .join('');
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.pink};border-radius:20px;">
    <tr><td style="padding:24px 28px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${body}</table>
    </td></tr>
  </table>`;
}

/** Quoted visitor message (already escaped). */
export function quoteBox(label: string, html: string): string {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">
    <tr><td style="padding:0 0 6px;font-family:${SANS};font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:${C.ink3};">${label}</td></tr>
    <tr><td style="padding:16px 20px;border-left:2px solid ${C.tan};background:${C.page};font-family:${SANS};font-size:15px;line-height:1.6;color:${C.ink2};">${html}</td></tr>
  </table>`;
}

export function button(href: string, label: string): string {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">
    <tr><td style="border-radius:999px;background:${C.wine};">
      <a href="${esc(href)}" style="display:inline-block;padding:13px 26px;font-family:${SANS};font-size:15px;color:${C.page};text-decoration:none;border-radius:999px;">${label}</a>
    </td></tr>
  </table>`;
}

export function paragraph(html: string, extra = ''): string {
  return `<p style="margin:0 0 16px;font-family:${SANS};font-size:16px;line-height:1.65;color:${C.ink2};${extra}">${html}</p>`;
}

export function link(href: string, label: string): string {
  return `<a href="${esc(href)}" style="color:${C.wine};text-decoration:underline;text-decoration-color:${C.tan};">${label}</a>`;
}

/** Big serif headline, optionally with a burgundy italic part. */
export function headline(main: string, accent = ''): string {
  return `<h1 style="margin:0 0 18px;font-family:${SERIF};font-weight:400;font-size:34px;line-height:1.15;color:${C.ink};">${main}${
    accent ? ` <em style="color:${C.wine};">${accent}</em>` : ''
  }</h1>`;
}

export function eyebrow(text: string): string {
  return `<p style="margin:0 0 10px;font-family:${SANS};font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:${C.ink3};">${text}</p>`;
}

export function layout(opts: { lang: string; preheader: string; content: string; footer: string }): string {
  return `<!doctype html>
<html lang="${esc(opts.lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>Melanie Beeckman</title>
</head>
<body style="margin:0;padding:0;background:${C.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(opts.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page};">
  <tr><td align="center" style="padding:32px 16px 40px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
      <tr><td align="center" style="padding:0 0 22px;">
        <img src="cid:${LOGO_CID}" width="44" height="44" alt="" style="display:block;border:0;margin:0 auto 10px;">
        <div style="font-family:${SERIF};font-size:24px;color:${C.wine};letter-spacing:.01em;">Melanie Beeckman</div>
      </td></tr>
      <tr><td style="background:${C.paper};border:1px solid ${C.line};border-radius:28px;padding:36px 32px 32px;">
        ${opts.content}
      </td></tr>
      <tr><td align="center" style="padding:24px 12px 0;font-family:${SANS};font-size:13px;line-height:1.7;color:${C.ink3};">
        ${opts.footer}
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}
