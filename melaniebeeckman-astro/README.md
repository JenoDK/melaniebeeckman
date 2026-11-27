# melaniebeeckman-astro

Static site (Astro 5) in NL, EN and FR. See the README in the repository root for the full picture.

- Copy: `src/i18n/base.ts` (pages) and `src/i18n/extra.ts` (titles, messages, contact form). No em dashes.
- Practice details (phone, email, addresses, Rosa link): `src/lib/site.ts`.
- Booking tool: `src/components/SessionsApp.astro`, talks to Strapi in the browser.
- Forms: `src/components/InquiryForm.astro`.
- Styles: `src/styles/global.css` (E2 palette: pink and sand, burgundy accents).

```bash
cp .env.example .env
npm install
npm run dev     # http://localhost:4321
npm run build   # output in dist/
```
