import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ user: null }, { status: 200 });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("Session lookup failed", error);
    return NextResponse.json({ error: "Unable to read session." }, { status: 500 });
  }
}
