# MongoDB Atlas setup

JantaNet uses a **new, empty MongoDB database** through Prisma's MongoDB connector. The intended database name is `jantanet`.

## Configure local development

1. Create a MongoDB Atlas cluster and a database user with a strong password.
2. Add your development IP to the Atlas network access list. For production, allow only the outbound IP ranges supported by your hosting plan where possible; avoid a permanent `0.0.0.0/0` rule.
3. In Atlas, open **Connect → Drivers**, copy the Node.js connection string, and replace the placeholders.
4. Ensure the database name `jantanet` appears after the cluster hostname and **before** the question mark.
5. Set `DATABASE_URL` in your local environment:

```env
DATABASE_URL=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/jantanet?retryWrites=true&w=majority
```

**Important:** A URI ending in `.mongodb.net/?retryWrites=true...` is missing its database name and causes Prisma error `P1013: Database must be defined`. The correct path is `/jantanet`, not an empty `/`. If your database user password contains reserved URL characters such as `@`, `:`, `/`, `?`, `#`, or `%`, percent-encode those characters in the password.

Run `npm install`, `npm run db:generate`, then `npm run db:deploy`. The deploy command validates the URI without printing credentials before running `prisma db push`.

## Render

In the JantaNet Render web service, open **Environment → Environment Variables** and set:

- Key: `DATABASE_URL`
- Value: the complete Atlas URI, including `/jantanet` before `?retryWrites`.

Save the change and deploy the latest `main` commit. The start command runs the URL preflight and `prisma db push` before starting Next.js. Do not paste the URI into GitHub, logs, screenshots, or chat.

If the preflight says the database name is missing, update the Render variable to this structure (replace placeholders with the Atlas values):

```
mongodb+srv://DB_USER:ENCODED_PASSWORD@cluster0.example.mongodb.net/jantanet?retryWrites=true&w=majority
```

The health endpoint pings MongoDB and returns HTTP 503 when the database is unreachable.

## Fresh database decision

This setup intentionally starts with a **fresh database**. Do not import or copy records from the previous PostgreSQL database. The first users, posts and other records will be created in MongoDB after the application is connected. Point Render only to the new Atlas database named `jantanet`, not to the old PostgreSQL URL.

## Current scope

The current schema covers identity, sessions, posts, comments, likes, follows, groups, pages, polls and events. MongoDB connectivity is a prerequisite, not proof that the remaining product modules (messaging, calls, marketplace, jobs, cloud storage, payments, AI and administration) are implemented. Those require separate feature work and tests.
