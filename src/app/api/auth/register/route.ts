import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, hasSameOrigin } from "@/lib/auth";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.string().trim().email().max(254),
  password: z.string().min(10).max(72)
});

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success || Buffer.byteLength(parsed.data?.password ?? "", "utf8") > 72) {
    return NextResponse.json({ error: "Please enter a valid name, email and password (10–72 characters)." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  try {
    const passwordHash = await hash(parsed.data.password, 12);
    const user = await prisma.user.create({
      data: { name: parsed.data.name, email, passwordHash },
      select: { id: true }
    });
    await createSession(user.id);
    return NextResponse.json({ user: { id: user.id, name: parsed.data.name, email } }, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }
    console.error("Registration failed", error);
    return NextResponse.json({ error: "Unable to create your account right now." }, { status: 500 });
  }
}
