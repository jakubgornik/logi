import { routeGuard } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { customerSchema } from "@/modules/customer/customer-form.validation";
import { NextRequest, NextResponse } from "next/server";

export const POST = routeGuard(async (request: NextRequest, { user }) => {
  const payload = customerSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }

  const { isAppUser, appUserId, ...data } = payload.data;

  try {
    if (isAppUser && appUserId) {
      const linkedUser = await prisma.user.findUnique({
        where: { id: appUserId },
      });

      if (!linkedUser) {
        return NextResponse.json(
          { message: "The selected app user does not exist." },
          { status: 404 }
        );
      }

      await prisma.customer.create({
        data: {
          sellerId: user.id,
          customerName: linkedUser.customerName,
          addressCountry: linkedUser.addressCountry,
          addressCity: linkedUser.addressCity,
          addressStreet: linkedUser.addressStreet,
          addressPostalCode: linkedUser.addressPostalCode,
          appUserId: linkedUser.id,
        },
      });

      return NextResponse.json(
        { message: "App user linked successfully" },
        { status: 201 }
      );
    }

    await prisma.customer.create({
      data: {
        sellerId: user.id,
        customerName: data.customerName,
        addressCountry: data.addressCountry,
        addressCity: data.addressCity,
        addressStreet: data.addressStreet,
        addressPostalCode: data.addressPostalCode,
      },
    });

    return NextResponse.json(
      { message: "Customer created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
});
