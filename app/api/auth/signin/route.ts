import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "app-session";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { message: "ID token is required." },
        { status: 400 }
      );
    }

    const admin = getFirebaseAdmin();
    const token = await admin.auth().verifyIdToken(idToken);
    const uid = token.uid;

    const user = await prisma.user.findUnique({
      where: { authId: uid },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found in database." },
        { status: 404 }
      );
    }

    const accessToken = jwt.sign(
      {
        userId: user.id,
        authId: user.authId,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    const cookie = serialize(COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 24 * 1, // 1 day
      sameSite: "lax",
      path: "/",
    });

    const response = NextResponse.json(
      { message: "Signed in successfully." },
      { status: 200 }
    );
    response.headers.set("Set-Cookie", cookie);

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Authentication failed." },
      { status: 401 }
    );
  }
}
