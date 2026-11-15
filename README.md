# JantaNet

**Connect • Chat • Share • Earn**

JantaNet is a modular, privacy-first digital community platform. The repository is delivered in phases; the foundation and identity groundwork are being developed before messaging, creator, commerce, cloud, and payment modules are enabled.

## Current implementation
- Next.js App Router, React and TypeScript foundation.
- Responsive public landing page and initial design system.
- Identity groundwork: email/password registration and login, opaque server-side sessions, logout, current-user endpoint, profile update API, and protected profile page.
- MongoDB Prisma schema for users, sessions, posts, comments, likes, follows, groups, pages, polls and events.
- First-admin seed script; public registration cannot assign privileged roles.
- SEO metadata, sitemap, robots and a health endpoint that checks MongoDB connectivity.

**Database:** JantaNet now uses a new, empty MongoDB database named `jantanet`. The previous PostgreSQL records are intentionally not migrated. Set the MongoDB Atlas SRV URI as `DATABASE_URL` in the hosting environment. See [MongoDB setup](docs/MONGODB_SETUP.md).

**Production note:** MongoDB connectivity alone does not make registration production-ready. Email verification, password recovery, distributed rate limiting, CAPTCHA/bot protection, and independent security review are still required before opening registration to the public.

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
3. Copy `.env.example` to `.env.local`; set `DATABASE_URL` to your MongoDB Atlas URI using the `jantanet` database.
4. Run `npm run db:generate` and `npm run db:deploy` to generate Prisma Client and sync the MongoDB schema.
5. Run `npm run dev`.

Useful commands: `npm run db:generate`, `npm run db:migrate` (schema push), `npm run db:deploy`, `npm run db:seed`, `npm run typecheck`, `npm run lint`, `npm run build`.

### First administrator
Set `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` (at least 14 characters), and optionally `SEED_ADMIN_NAME` in a private environment, then run `npm run db:seed` once. Never put these values in source control or expose this seed process as a public endpoint.

## Architecture and security
See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/SECURITY.md](docs/SECURITY.md), and [docs/MONGODB_SETUP.md](docs/MONGODB_SETUP.md). Never commit real credentials, OTPs, access tokens, private keys, or production user data.

## Security boundaries
- No real credentials are stored in this repository.
- Public registration always creates a USER role.
- Sessions store only a hash of a cryptographically random token.
- Payment custody, end-to-end encrypted chat, large-scale video and billion-user capacity are not claimed as implemented.

## Community modules (Phase 3)
- `/feed`: authenticated post feed with post creation, likes and paginated listing.
- `/community`: create and browse public groups, pages, polls and upcoming events.
- API routes under `/api/groups`, `/api/pages`, `/api/polls`, and `/api/events` support membership, following, voting and attendance.
- Render runs `npm run db:deploy` before app startup to sync the Prisma schema to MongoDB.

Private group join requests, moderation workflows, notifications, media uploads and real-time updates are not implemented yet. Do not expose this build publicly until the database connection, email verification, rate limiting and production security checks pass.
