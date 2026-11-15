# MongoDB Atlas setup

JantaNet now targets MongoDB through Prisma's MongoDB connector.

## Configure local development

1. Create a MongoDB Atlas cluster and a database user with a strong password.
2. Add your development IP to the Atlas network access list. For production, allow only the outbound IP ranges supported by your hosting plan where possible; avoid a permanent `0.0.0.0/0` rule.
3. Copy the Atlas SRV connection string and select the `jantanet` database name.
4. Set `DATABASE_URL` in your local environment:

```env
DATABASE_URL=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/jantanet?retryWrites=true&w=majority
```

5. Run `npm install`, `npm run db:generate`, then `npm run db:deploy`.

## Render

Set the Render service's `DATABASE_URL` environment variable to the Atlas connection string. Keep it secret; do not commit it to Git. The start command runs `prisma db push` before starting Next.js.

The health endpoint now pings MongoDB and returns HTTP 503 when the database is unreachable.

## Important migration note

Changing the Prisma provider does not migrate existing PostgreSQL records. This schema uses MongoDB ObjectIds, so existing PostgreSQL CUID identifiers cannot be copied directly into the new collections. If the previous PostgreSQL database contains production users or content, export and transform those records into new MongoDB ObjectIds before switching traffic. Do not point this release at the old PostgreSQL URL.

## Current scope

The current schema covers identity, sessions, posts, comments, likes, follows, groups, pages, polls and events. MongoDB connectivity is a prerequisite, not proof that the remaining product modules (messaging, calls, marketplace, jobs, cloud storage, payments, AI and administration) are implemented. Those require separate feature work and tests.
