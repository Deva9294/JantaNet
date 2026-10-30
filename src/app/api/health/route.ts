import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "j antanet-web".replace(" ", ""),
    phase: "foundation",
    timestamp: new Date().toISOString()
  });
}
