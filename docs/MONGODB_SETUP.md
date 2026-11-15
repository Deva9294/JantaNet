# MongoDB Atlas setup

JantaNet uses a **new, empty MongoDB database** through Prisma's MongoDB connector. The intended database name is `jantanet`.

## Configure local development

1. Create a MongoDB Atlas cluster and a database user with a strong password.
2. Add your development IP to the Atlas network access list. For production, allow only the outbound IP ranges supported by your hosting plan where possible; avoid a permanent `0.0.0.0/0` rule.
3. Copy the Atlas SRV connection string and use the `jantanet` database name.
4. Set `DATABASE_URL` in your local environment:

```env
DATABASE_URL=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/jantanet?retryWrites=true&w=majority
```

5. Run `npm install`, `npm run db:generate`, then `npm run db:deploy`.

## Render

Set the Render service's `DATABASE_URL` environment variable to the Atlas connection string. Keep it secret; do not commit it to Git or send it in chat. The start command runs `prisma db push` before starting Next.js.

The health endpoint pings MongoDB and returns HTTP 503 when the database is unreachable.

## Fresh database decision

This setup intentionally starts with a **fresh database**. Do not import or copy records from the previous PostgreSQL database. The first users, posts and other records will be created in MongoDB after the application is connected. Point Render only to the new Atlas database named `jantanet`, not to the old PostgreSQL URL.

## Current scope

The current schema covers identity, sessions, posts, comments, likes, follows, groups, pages, polls and events. MongoDB connectivity is a prerequisite, not proof that the remaining product modules (messaging, calls, marketplace, jobs, cloud storage, payments, AI and administration) are implemented. Those require separate feature work and tests.
