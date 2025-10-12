import passport from "./passport";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@prisma/client";
import { AuthenticatedHandler } from "@/lib/types/auth.types";

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
  return async (req: NextRequest, { params }: { params: TParams }) => {
    try {
      const user = await authenticateRequest(req);

      return handler(req, { user, params });
    } catch (error) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  };
};
