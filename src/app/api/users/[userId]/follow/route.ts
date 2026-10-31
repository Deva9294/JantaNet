import { NextResponse } from "next/server";
import { getCurrentUser, hasSameOrigin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request, context: { params: Promise<{ userId: string }> }) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { userId } = await context.params;
  if (userId === user.id) return NextResponse.json({ error: "You cannot follow yourself." }, { status: 400 });
  const target = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!target) return NextResponse.json({ error: "User not found." }, { status: 404 });
  const key = { followerId_followingId: { followerId: user.id, followingId: userId } };
  const existing = await prisma.follow.findUnique({ where: key });
  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    return NextResponse.json({ following: false });
  }
  await prisma.follow.create({ data: { followerId: user.id, followingId: userId } });
  return NextResponse.json({ following: true });
}
