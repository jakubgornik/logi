import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { routeGuard } from "@/lib/auth";

export const GET = routeGuard(async (_, { user, searchParams }) => {
  const appUsers = await prisma.user.findMany({
    where: {
      id: {
        not: user.id,
      },
      recordsAsCustomer: {
        none: {
          sellerId: user.id,
        },
      },
      isCustomer: true,
      customerName: {
        contains: searchParams.search,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      email: true,
      customerName: true,
      addressCountry: true,
      addressCity: true,
      addressStreet: true,
      addressPostalCode: true,
    },
  });

  if (!appUsers) {
    return NextResponse.json({ message: "Users not found" }, { status: 404 });
  }

  return NextResponse.json(appUsers);
});
