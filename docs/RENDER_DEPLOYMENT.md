# Deploy JantaNet on Render

The repository includes a Render Blueprint at `render.yaml`. It creates a Node web service and deploys from the `main` branch.

## Required before first deploy

1. Merge the deployment-ready pull request into `main`.
2. Create a managed PostgreSQL database. Use a production database with backups enabled; do not use an ephemeral/local database.
3. In the Render web service environment, set `DATABASE_URL` to the database's **internal** connection URL when the database and service are in the same Render region. Keep TLS/SSL required as directed by the database provider. Never commit this value.
4. Confirm `NEXT_PUBLIC_APP_URL` matches the actual public Render service URL. The blueprint default is `https://jantanet.onrender.com`; change it if Render assigns a different hostname or a custom domain is connected.
5. Deploy. The build runs `npm install --include=dev`, Prisma Client generation and `next build`. The explicit `--include=dev` is required because TypeScript, ESLint and Prisma CLI are development dependencies even when Render sets `NODE_ENV=production`. The start command applies committed migrations using `prisma migrate deploy` before starting Next.js.

## Render settings

- Runtime: Node
- Node version: 20+ (the package requires Node >=20.9)
- Build: `npm install --include=dev && npm run db:generate && npm run build`
- Start: `npm run db:deploy && npm start`
- Health check: `/api/health`
- Required secret: `DATABASE_URL`

The repository currently has no npm lockfile, so the blueprint uses `npm install --include=dev` rather than `npm ci`. Add and commit a lockfile before adopting immutable/reproducible installs.

## First administrator

Only after the database is connected and migrations have completed, set `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` (14+ characters) and optionally `SEED_ADMIN_NAME` as private environment variables, then run `npm run db:seed` once from a secure environment. Do not add a public admin-registration endpoint and do not leave the seed password configured longer than needed.

## Launch limitations

This is a deployable early-stage foundation, not a public-launch-ready social platform. Before opening registration broadly, implement email verification and password recovery, distributed rate limits/bot protection, automated auth tests, security headers and independent security review. Configure database backups and test restoration. Messaging, media uploads, moderation, realtime notifications, payments, creator tools and cloud storage are not implemented.

The health endpoint checks that the web process responds; it does not prove database connectivity. Verify registration/login and migration status in a private staging environment before public use. Free Render services may sleep and have limited resources; choose an appropriate paid instance and database plan for production reliability.
