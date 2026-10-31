import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, hasSameOrigin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
const schema = z.object({ content: z.string().trim().min(1).max(2000) });

export async function GET(_request: Request, context: { params: Promise<{ postId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { postId } = await context.params;
  const comments = await prisma.comment.findMany({
    where: { postId }, take: 50, orderBy: { createdAt: "asc" },
    include: { author: { select: { id: true, name: true, avatarUrl: true } } }
  });
  return NextResponse.json({ comments });
}

export async function POST(request: Request, context: { params: Promise<{ postId: string }> }) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { postId } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Comment must contain 1–2000 characters." }, { status: 400 });
  const exists = await prisma.post.findUnique({ where: { id: postId }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: "Post not found." }, { status: 404 });
  const comment = await prisma.comment.create({
    data: { postId, authorId: user.id, content: parsed.data.content },
    include: { author: { select: { id: true, name: true, avatarUrl: true } } }
  });
  return NextResponse.json({ comment }, { status: 201 });
}
