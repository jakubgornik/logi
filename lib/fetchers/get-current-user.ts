import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cache } from "react";
import { COOKIE_NAME } from "@/lib/shared/consts";
import { JWTPayload } from "@/lib/types/auth.types";

export const getCurrentUser = cache(async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const currentUser = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JWTPayload;

    const user = await prisma.user.findUnique({
      where: {
        id: currentUser.userId,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
});
