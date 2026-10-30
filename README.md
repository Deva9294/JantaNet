# JantaNet

**Connect • Chat • Share • Earn**

JantaNet is a modular, privacy-first digital community platform. The repository is delivered in phases; the initial foundation and identity groundwork are being developed before social, messaging, creator, commerce, cloud, and payment modules are enabled.

## Current implementation
- Next.js App Router, React and TypeScript foundation.
- Responsive public landing page and initial design system.
- Phase 2 identity groundwork: email/password registration and login, opaque server-side sessions, logout, current-user endpoint, profile update API, and protected profile page.
- PostgreSQL Prisma schema and initial migration.
- First-admin seed script; public registration cannot assign privileged roles.
- SEO metadata, sitemap, robots and health endpoint.

**Production note:** identity requires a configured PostgreSQL database. Email verification, password recovery, distributed rate limiting, CAPTCHA/bot protection, and independent security review are still required before opening registration to the public.

## Planned phases
1. **Foundation** — app scaffold, design system, landing page, SEO, health checks and architecture.
2. **Identity** — registration, login, sessions, profiles, roles, verification, recovery and device controls.
3. **Social core** — feed, posts, reactions, comments, follows, profiles, pages, groups, polls and events.
4. **Messaging** — conversations, realtime delivery, attachments, presence and notifications; E2E design and threat model before claiming encrypted chats.
5. **Communities & business** — servers, channels, roles, business pages, CRM/leads, jobs and marketplace foundations.
6. **Creator economy** — media publishing, creator studio, subscriptions, tips, memberships and analytics.
7. **Cloud & AI** — storage quotas, sharing, backups, AI assistant/search/recommendations with consent and cost controls.
8. **Payments & monetization** — compliant payment-provider integration, ledger/reconciliation, subscriptions, merchant flows and risk controls.
9. **Scale & governance** — observability, security testing, accessibility, localization, performance, disaster recovery and progressive infrastructure scaling.

## Local development
1. Install Node.js 20.9 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`; set `DATABASE_URL` to a PostgreSQL database.
4. Run `npm run db:deploy` to apply committed migrations.
5. Run `npm run dev`.

Useful commands: `npm run db:generate`, `npm run db:migrate`, `npm run db:deploy`, `npm run db:seed`, `npm run typecheck`, `npm run lint`, `npm run build`.

### First administrator
Set `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` (at least 14 characters), and optionally `SEED_ADMIN_NAME` in a private environment, then run `npm run db:seed` once. Never put these values in source control or expose this seed process as a public endpoint.

## Architecture and security
See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/SECURITY.md](docs/SECURITY.md). Never commit real credentials, OTPs, access tokens, private keys, or production user data.

## Security boundaries
- No real credentials are stored in this repository.
- Public registration always creates a USER role.
- Sessions store only a hash of a cryptographically random token.
- Payment custody, end-to-end encrypted chat, large-scale video and billion-user capacity are not claimed as implemented.
