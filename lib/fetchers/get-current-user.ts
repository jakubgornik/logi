import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cache } from "react";
import { COOKIE_NAME } from "@/lib/shared/consts";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export const getCurrentUser = cache(async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }
    const { payload } = await jwtVerify(token, SECRET);

    if (!payload) {
      throw new Error("Invalid token payload");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId as string,
      },
      include: {
        contracts: true,
      },
    });

    if (!user) {
      throw new Error("User no longer exists");
    }

    return user;
  } catch (error) {
    return null;
  }
});
