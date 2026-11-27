# melaniebeeckman.be

Website of Melanie Beeckman, clinical psychologist in Ghent and Lokeren.

| Part | What it does |
|---|---|
| `melaniebeeckman-astro` | Static site in NL, EN and FR. All page copy lives here, in `src/i18n/base.ts` and `src/i18n/extra.ts`. |
| `melaniebeeckman-strapi` | Strapi 5. Only what changes without a developer: sessions, bookings, requests and the waitlist. Sends the emails. |

## How it fits together

```
Visitor ──> static Astro site (nginx)
              │  in the browser, on the Sessions page and the forms:
              ├─ GET  /api/booking/sessions                 upcoming sessions + live places left
              ├─ POST /api/booking/sessions/:id/register    book places
              ├─ POST /api/booking/waitlist                 "keep me posted"
              └─ POST /api/booking/inquiries                group session / talk / contact message
                         │
                       Strapi ──> Postgres
                         └──> SMTP (Resend or Cloudflare) ──> email to Melanie + confirmation to the client
```

The site no longer reads anything from Strapi at build time, so **no rebuild webhook is needed**.
Adding a session in Strapi shows up on the site immediately. Copy changes go through a developer:
edit the i18n files, build, deploy.

## What Melanie does in the Strapi admin

- **Session**: add a date (type, start, end, location, capacity, price) and **publish** it. Only published sessions appear on the site. Switch off "booking open" to stop bookings for one session.
- **Registration**: everyone who booked. To cancel someone, set *booking status* to `cancelled`; their places become free again.
- **Inquiry**: requests from organisations and contact messages. Tick *handled* when done.
- **Waitlist entry**: people who want to hear about new dates.
- **Booking settings**: close all bookings at once, or change the maximum places per booking (default 3).
- **Location**: the practice addresses used by sessions.

She gets an email for every booking and every inquiry, with Reply-To set to the visitor.

## Local development

```bash
# Strapi (http://localhost:1337/admin)
cd melaniebeeckman-strapi
cp .env.example .env        # fill in the secrets; leave SMTP_HOST empty to only log emails
npm install
npm run develop

# Astro (http://localhost:4321)
cd melaniebeeckman-astro
cp .env.example .env        # PUBLIC_STRAPI_URL=http://localhost:1337
npm install
npm run dev
```

Without `SMTP_HOST`, Strapi writes the emails to its log (`[mail:dev]`) instead of sending them.

## Environment variables

**Strapi** (`melaniebeeckman-strapi/.env`, or the root `.env` used by Docker Compose; see `example-strapi.env`):

| Variable | Purpose |
|---|---|
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USERNAME`, `SMTP_PASSWORD` | Outgoing mail. Resend: `smtp.resend.com`, `465`, `true`, `resend`, API key. Cloudflare: `smtp.mx.cloudflare.net`, `465`, `true`, `api_token`, API token. |
| `MAIL_FROM` | e.g. `Melanie Beeckman <noreply@melaniebeeckman.be>` |
| `MAIL_REPLY_TO` | Where clients' replies to confirmations go, e.g. `info@melaniebeeckman.be` |
| `NOTIFY_EMAIL` | Melanie's inbox for new bookings and inquiries |
| `CLIENT_MAIL_DAILY_LIMIT` | Max confirmations to clients per day (default 40, `0` = no limit). Protects the sending quota if a bot gets through. |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret. Empty = no bot check. |
| `CORS_ORIGINS` | Sites allowed to call the API from the browser, comma separated. |

**Astro** (`melaniebeeckman-astro/.env`, needed at build time):

| Variable | Purpose |
|---|---|
| `PUBLIC_STRAPI_URL` | Public URL of Strapi as the browser sees it, e.g. `https://melaniebeeckman.be/strapi` |
| `PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key. Must be set together with the Strapi secret. |

## Production

- Strapi and Postgres run with `docker-compose.yml`. Nginx serves the Astro `dist/` folder and proxies `/strapi/` to Strapi on `127.0.0.1:1337`.
- Nginx must pass the visitor's IP: `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`. The rate limiter uses it.
- Deploying the site: `cd melaniebeeckman-astro && npm ci && npm run build`, then copy `dist/` to the web root.
- **Before the first deploy of the Strapi rework:** back up Postgres (`docker exec strapiDB pg_dump -U <user> <db> > backup.sql`). Strapi drops the tables of the removed content types (homepage, faq, ...) on start.
- Back up the database regularly; it now holds bookings.

## Email setup (one time)

1. Cloudflare: **Email Routing**, forward `info@melaniebeeckman.be` to Melanie's Gmail.
2. **Resend** (free, 3,000 mails a month): add the domain `melaniebeeckman.be` in region `eu-west-1`, let it add the DNS records on Cloudflare (DNS only, grey cloud), create an API key with sending access.
   Or **Cloudflare Email Sending** (Workers Paid, $5 a month): onboard the domain and create an API token with *Email Sending: Edit*.
3. Add a DMARC record: `_dmarc` TXT `v=DMARC1; p=none; rua=mailto:info@melaniebeeckman.be`.
4. Fill in the SMTP variables above and restart Strapi.
5. Optional but recommended: Cloudflare **Turnstile**, add a widget for `melaniebeeckman.be` (managed mode), put the site key in Astro and the secret in Strapi.
