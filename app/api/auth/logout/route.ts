import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/shared/consts";

export async function POST() {
  const cookie = serialize(COOKIE_NAME, "", {
    ...COOKIE_OPTIONS,
    maxAge: -1, // expire cookie
  });

  const response = NextResponse.json({ message: "Signed out successfully." });
  response.headers.set("Set-Cookie", cookie);

  return response;
}
