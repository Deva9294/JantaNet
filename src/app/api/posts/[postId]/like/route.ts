import { NextResponse } from "next/server";
import { getCurrentUser, hasSameOrigin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request, context: { params: Promise<{ postId: string }> }) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { postId } = await context.params;
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true } });
  if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });
  const existing = await prisma.like.findUnique({ where: { postId_userId: { postId, userId: user.id } } });
  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return NextResponse.json({ liked: false });
  }
  await prisma.like.create({ data: { postId, userId: user.id } });
  return NextResponse.json({ liked: true });
}
