import { routeGuard } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { userSchema } from "@/modules/settings/user-form.validation";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  id: string;
}

export const PUT = routeGuard<RouteParams>(
  async (request: NextRequest, { params }) => {
    const { id } = params;
    const payload = userSchema.safeParse(await request.json());

    if (!payload.success) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: payload.data,
      });

      return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Error updating" }, { status: 500 });
    }
  }
);
