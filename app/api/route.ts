import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { routeGuard } from "@/lib/auth";

export const GET = routeGuard(async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      message: `API ok`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Service Unavailable" },
      { status: 503 }
    );
  }
});
