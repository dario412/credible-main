# Credible Creators

SEO-optimized website and admin portal for Credible Creators — a talent agency for the expert economy.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- PostgreSQL + Prisma
- Auth.js (credentials) + TOTP two-factor authentication

## Quick start

1. Copy env and start Postgres:

```bash
cp .env.example .env
docker compose up -d
```

2. Install, migrate, seed:

```bash
npm install
npx prisma migrate dev
npm run db:seed
```

3. Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

### Seeded owner

- Email: `dario@positivestudio.co` (override with `ADMIN_EMAIL`)
- Password: set via `ADMIN_PASSWORD` in `.env`
- On first login you will be prompted to enrol 2FA (Authenticator app)

## Public pages

| Path | Description |
|------|-------------|
| `/` | Home + waitlist |
| `/roster` | Experts with filters |
| `/roster/[slug]` | Expert profile |
| `/what-we-do` | Services |
| `/case-studies`, `/case-studies/[slug]` | Case studies |
| `/insights`, `/insights/[slug]` | Insights |
| `/about`, `/contact`, `/privacy`, `/terms` | Site pages |

## Admin (noindex)

Admin routes are excluded from `robots.txt` and use `robots: noindex`.

| Path | Access |
|------|--------|
| `/admin` | Dashboard |
| `/admin/leads` | All form submissions |
| `/admin/users` | User management (Owner) |
| `/admin/style-guide` | Design system reference |

### Roles

- **Owner** — view leads, manage users, manage content (reserved)
- **Editor** — view leads, manage content (reserved)
- **Viewer** — view leads only

## Environment

See `.env.example`:

- `DATABASE_URL` — Postgres connection string
- `AUTH_SECRET` — `openssl rand -base64 32`
- `AUTH_URL` / `NEXT_PUBLIC_SITE_URL` — public site URL
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — used only by the seed script
