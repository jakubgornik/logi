import { routeGuard } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { userSchema } from "@/modules/settings/user-form.validation";
import { NotificationType } from "@/prisma/client/enums";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  id: string;
}

export const PUT = routeGuard<RouteParams>(
  async (request: NextRequest, { user, params }) => {
    const { id } = params;

    if (id !== user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const payload = userSchema.safeParse(await request.json());

    if (!payload.success) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          ...payload.data,
          notifications: {
            create: {
              type: NotificationType.USER_UPDATED,
            },
          },
        },
      });

      return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
      console.error("User Update Error:", error);
      return NextResponse.json({ message: "Error updating" }, { status: 500 });
    }
  },
);
