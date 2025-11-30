import passport from "./passport";
import { NextRequest, NextResponse } from "next/server";
import { AuthenticatedHandler } from "@/lib/types/auth.types";
import { User } from "@/prisma/client/client";

function authenticateRequest(req: NextRequest): Promise<User> {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      (err: unknown, user: User | false) => {
        if (err || !user) {
          return reject(new Error("Unauthorized"));
        }
        return resolve(user);
      }
    )(req);
  });
}

export const routeGuard = <TParams>(handler: AuthenticatedHandler<TParams>) => {
  return async (req: NextRequest, props: { params: Promise<TParams> }) => {
    try {
      const user = await authenticateRequest(req);
      const params = await props.params;
      const searchParams = Object.fromEntries(req.nextUrl.searchParams);

      return handler(req, { user, params, searchParams });
    } catch (error) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  };
};
