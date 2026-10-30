# JantaNet Architecture

## Current foundation (Phase 1)
The initial release is a Next.js App Router application with TypeScript, server-rendered public pages, a small accessible CSS design system, metadata defaults and a health endpoint. No external database or paid service is required to boot the landing page.

## Target logical boundaries
- **Identity**: accounts, credentials, sessions, verification, recovery, devices and role-based access.
- **Social**: profiles, posts, reactions, comments, follows, feeds, groups, pages, polls and events.
- **Messaging**: conversations, message delivery, presence, attachments, notification fan-out and call signalling.
- **Community/business**: servers, channels, roles, business pages, CRM, leads, jobs and marketplace.
- **Creator**: media library, publishing pipeline, subscriptions, tips, memberships and creator analytics.
- **Cloud**: object metadata, quotas, sharing grants, lifecycle, backup and restore.
- **Payments**: provider adapters, immutable ledger entries, reconciliation, refunds, subscriptions and risk review.
- **AI**: consent-aware assistant, retrieval/search, translation, recommendations and moderation.
- **Platform**: audit logs, feature flags, observability, localization, abuse prevention and admin operations.

## Data and service decisions
PostgreSQL is the planned system of record for relational entities and transactions. Redis may be introduced for ephemeral presence, caching, rate limiting and queues. Object storage (S3-compatible) is the only planned home for user media; application instances must remain stateless. Search should begin with PostgreSQL capabilities and move to a dedicated search service only when measured requirements justify it.

Start with a modular monolith and explicit domain boundaries. Extract independently deployed services only when scaling, reliability or team ownership requires it. This avoids early distributed-system complexity.

## API and event conventions
- Validate all external input at the boundary (Zod or equivalent).
- Use explicit DTOs; never expose database models directly.
- Use pagination, idempotency keys for financial operations and stable error envelopes.
- Publish domain events through an outbox before introducing asynchronous consumers.
- Version public APIs and document authorization requirements.
- Keep secrets in environment variables or a managed secret store.

## Scaling path
1. Stateless web instances behind a CDN/load balancer.
2. Managed PostgreSQL with backups, connection pooling and read replicas as needed.
3. Redis-backed queues and ephemeral state.
4. Object storage + CDN for media.
5. Dedicated realtime gateways and media infrastructure after load testing.
6. Partitioning, regional deployment and service extraction only based on measured bottlenecks.

A billion-user ambition is a product direction, not a current capacity claim. Capacity must be established through architecture reviews, load tests, security reviews and operational readiness.
