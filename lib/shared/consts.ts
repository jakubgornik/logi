export const COOKIE_NAME = "app-session";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== "development",
  maxAge: 60 * 60 * 24 * 1, // 1 day
  sameSite: "lax" as const,
  path: "/",
};

export const JWT_SIGN_OPTIONS = { expiresIn: "1d" } as const;
