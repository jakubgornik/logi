import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "./prisma";
import { COOKIE_NAME } from "./shared/consts";
import { AuthenticatedHandler } from "@/lib/types/auth.types";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export const routeGuard = <TParams>(handler: AuthenticatedHandler<TParams>) => {
  return async (req: NextRequest, props: { params: Promise<TParams> }) => {
    try {
      const token = req.cookies.get(COOKIE_NAME)?.value;
      if (!token) {
        throw new Error("No token found");
      }
      const { payload } = await jwtVerify(token, SECRET);

      if (!payload) {
        throw new Error("Invalid token payload");
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.userId as string },
      });

      if (!user) {
        throw new Error("User no longer exists");
      }

      const params = await props.params;
      const searchParams = Object.fromEntries(req.nextUrl.searchParams);

      return handler(req, { user, params, searchParams });
    } catch (error) {
      console.error("Auth Error:", error);
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  };
};
