import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import type { NextRequest } from "next/server";
import { JWTPayload } from "@/lib/types/auth.types";
import { prisma } from "./prisma";
import { COOKIE_NAME } from "./shared/consts";

const cookieExtractor = (req: NextRequest): string | null => {
  if (req.cookies) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    return token || null;
  }
  return null;
};

const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET!,
};

passport.use(
  new JwtStrategy(options, async (payload: JWTPayload, validate) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });
      if (user) {
        return validate(null, user);
      }
      return validate(null, false);
    } catch (error) {
      return validate(error, false);
    }
  })
);

export default passport;
