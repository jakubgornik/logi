import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { COOKIE_NAME } from "@/lib/shared/consts";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { userId: string; email: string };
  } catch {
    return null;
  }
}
