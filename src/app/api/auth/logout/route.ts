import { NextResponse } from "next/server";
import { destroyCurrentSession, hasSameOrigin } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  await destroyCurrentSession();
  return NextResponse.json({ success: true });
}
