import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, hasSameOrigin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
const createSchema = z.object({ content: z.string().trim().min(1).max(5000) });

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");
  const posts = await prisma.post.findMany({
    take: 21,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
      _count: { select: { likes: true, comments: true } },
      likes: { where: { userId: user.id }, select: { id: true } }
    }
  });
  const hasMore = posts.length > 20;
  const items = posts.slice(0, 20).map(({ likes, ...post }) => ({ ...post, likedByMe: likes.length > 0 }));
  return NextResponse.json({ posts: items, nextCursor: hasMore ? items[items.length - 1]?.id : null });
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Post must contain 1–5000 characters." }, { status: 400 });
  const post = await prisma.post.create({
    data: { authorId: user.id, content: parsed.data.content },
    include: { author: { select: { id: true, name: true, avatarUrl: true } }, _count: { select: { likes: true, comments: true } } }
  });
  return NextResponse.json({ post: { ...post, likedByMe: false } }, { status: 201 });
}
