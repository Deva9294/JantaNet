const raw = process.env.DATABASE_URL;

function fail(message) {
  console.error(\`[database config] \${message}\`);
  process.exit(1);
}

if (!raw || !raw.trim()) {
  fail("DATABASE_URL is missing. Add it in Render → Environment.");
}

let parsed;
try {
  parsed = new URL(raw.trim());
} catch {
  fail("DATABASE_URL is not a valid URL. Copy the MongoDB Atlas connection string again.");
}

if (parsed.protocol !== "mongodb+srv:" && parsed.protocol !== "mongodb:") {
  fail("DATABASE_URL must start with mongodb+srv:// or mongodb://.");
}

if (!parsed.hostname) {
  fail("DATABASE_URL is missing the MongoDB cluster hostname.");
}

const databaseName = parsed.pathname.replace(/^\/+|\/+$/g, "");
if (!databaseName) {
  fail("MongoDB database name is missing. Add /jantanet before the ? query string. Example: mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/jantanet?retryWrites=true&w=majority");
}

if (databaseName.includes("/")) {
  fail("DATABASE_URL contains an invalid database path. Use one database name: /jantanet.");
}

console.log(\`[database config] OK — MongoDB host configured; database path is /\${databaseName}. Credentials hidden.\`);
