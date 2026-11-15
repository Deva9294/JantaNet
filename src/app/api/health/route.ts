import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$runCommandRaw({ ping: 1 });
    return NextResponse.json({
      status: "ok",
      database: "connected",
      provider: "mongodb",
      service: "jantanet-web",
      timestamp: new Date().toISOString()
    });
  } catch {
    return NextResponse.json({
      status: "degraded",
      database: "disconnected",
      provider: "mongodb",
      service: "jantanet-web",
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
}
