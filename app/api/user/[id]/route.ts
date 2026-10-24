import { routeGuard } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { userSchema } from "@/modules/settings/user-form.validation";
import { NotificationType } from "@/prisma/client/enums";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  id: string;
}

const lockedBusinessFields = [
  "customerName",
  "addressCountry",
  "addressCity",
  "addressStreet",
  "addressPostalCode",
] as const;

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

    const hasBusinessFieldChanges = lockedBusinessFields.some(
      (field) => payload.data[field] !== user[field],
    );
    const isChangingLockedBusinessProfile =
      user.isCustomer && (!payload.data.isCustomer || hasBusinessFieldChanges);

    if (isChangingLockedBusinessProfile) {
      return NextResponse.json(
        { message: "Business profile details are locked after activation." },
        { status: 403 },
      );
    }

    try {
      const updatedUser = await prisma.$transaction(async (tx) => {
        const result = await tx.user.updateMany({
          where: { id: user.id, isCustomer: user.isCustomer },
          data: user.isCustomer
            ? { name: payload.data.name, scopes: payload.data.scopes }
            : payload.data,
        });

        if (result.count === 0) {
          return null;
        }

        await tx.notification.create({
          data: {
            userId: user.id,
            type: NotificationType.USER_UPDATED,
          },
        });

        return tx.user.findUniqueOrThrow({ where: { id: user.id } });
      });

      if (!updatedUser) {
        return NextResponse.json(
          { message: "Profile state changed. Refresh before saving again." },
          { status: 409 },
        );
      }

      return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
      console.error("User Update Error:", error);
      return NextResponse.json({ message: "Error updating" }, { status: 500 });
    }
  },
);
