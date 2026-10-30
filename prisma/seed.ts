import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME?.trim() || "JantaNet Admin";

  if (!email || !password) {
    throw new Error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create the first admin.");
  }
  if (password.length < 14 || Buffer.byteLength(password, "utf8") > 72) {
    throw new Error("Admin password must be at least 14 characters and at most 72 UTF-8 bytes.");
  }

  const passwordHash = await hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash, role: UserRole.ADMIN },
    create: { name, email, passwordHash, role: UserRole.ADMIN }
  });
  console.log("Admin account seeded.");
}

main().finally(async () => prisma.$disconnect());
