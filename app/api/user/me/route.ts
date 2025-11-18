import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { routeGuard } from "@/lib/auth";

export const GET = routeGuard(async (request, { user }) => {
  const currentUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!currentUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json(currentUser);
});
