import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "jantanet-web",
    phase: "foundation",
    timestamp: new Date().toISOString()
  });
}
