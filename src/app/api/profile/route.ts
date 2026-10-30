import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, hasSameOrigin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(2).max(60),
  bio: z.string().trim().max(280).nullable().optional()
});

export async function PATCH(request: Request) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please check your profile details." }, { status: 400 });

  const user = await prisma.user.update({
    where: { id: currentUser.id },
    data: { name: parsed.data.name, bio: parsed.data.bio ?? null },
    select: { id: true, name: true, email: true, bio: true, role: true }
  });
  return NextResponse.json({ user });
}
