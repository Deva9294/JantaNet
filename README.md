# JantaNet

**Connect • Chat • Share • Earn**

JantaNet is planned as a modular, privacy-first digital community platform. This repository is being built in phases; the first milestone establishes a maintainable application foundation before social, messaging, creator, commerce, cloud, and payment modules are added.

## Delivery principles
- Ship working, testable slices instead of a large unverified feature dump.
- Keep authentication, authorization, validation, auditability, and privacy at the core.
- Use provider interfaces for payments, storage, notifications, search, and AI so vendors can be changed safely.
- Never store secrets in source control. Configure them through deployment environment variables.
- Treat end-to-end encryption, regulated payments, video calling, and large-scale infrastructure as separately engineered milestones with security review.

## Planned phases
1. **Foundation** — Next.js App Router, TypeScript, responsive design system, public landing page, route structure, configuration, health endpoint, architecture and security documentation.
2. **Identity** — registration, login, email verification, sessions, profiles, roles, account recovery, device/session controls.
3. **Social core** — feed, posts, reactions, comments, follows, profiles, pages, groups, polls, events and moderation.
4. **Messaging** — conversations, realtime delivery, attachments, presence, notifications; E2E design and threat model before claiming encrypted chats.
5. **Communities & business** — servers, channels, roles, business pages, CRM/leads, jobs and marketplace foundations.
6. **Creator economy** — media publishing, creator studio, subscriptions, tips, memberships and analytics.
7. **Cloud & AI** — storage quotas, sharing, backups, AI assistant/search/recommendations with consent and cost controls.
8. **Payments & monetization** — compliant payment-provider integration, ledger/reconciliation, subscriptions, merchant flows and risk controls.
9. **Scale & governance** — observability, security testing, accessibility, localization, performance, disaster recovery and progressive infrastructure scaling.

## Initial architecture
- Web: Next.js App Router + React + TypeScript.
- Styling: Tailwind CSS with design tokens and accessible primitives.
- API: start with typed server-side route handlers; split services only when load and ownership justify it.
- Data: PostgreSQL as the source of truth; Redis for cache/queues/realtime coordination when introduced.
- Media: object-storage adapter (S3-compatible) plus CDN; do not store uploads in the application filesystem.
- Realtime: WebSocket/WebRTC adapters introduced in the messaging phase.
- Operations: environment-based configuration, structured logs, health checks, CI checks and documented deployment.

## Local development
1. Install Node.js 20.9 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and fill only the values for services you have configured.
4. Run `npm run dev`.

The foundation can run without database credentials; database-backed features will remain unavailable until configured.

## Security baseline
See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/SECURITY.md](docs/SECURITY.md). Never commit real credentials, OTPs, access tokens, private keys, or production user data.
