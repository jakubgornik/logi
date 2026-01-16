import { routeGuard } from "@/lib/auth";
import { getCustomers } from "@/lib/fetchers/get-customers";
import { prisma } from "@/lib/prisma";
import { IdArraySchema, paginatedQuerySchema } from "@/lib/types/common.types";
import { customerSchema } from "@/modules/customer/customer-form.validation";
import { NotificationType } from "@/prisma/client/enums";
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
          { status: 404 },
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
          notifications: {
            create: {
              userId: user.id,
              type: NotificationType.CUSTOMER_LINKED,
            },
          },
        },
      });

      return NextResponse.json(
        { message: "App user linked successfully" },
        { status: 201 },
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
        notifications: {
          create: {
            userId: user.id,
            type: NotificationType.CUSTOMER_CREATED,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Customer created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
});

export const DELETE = routeGuard(async (request: NextRequest, { user }) => {
  const payload = IdArraySchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json(
      {
        message: "Invalid data",
      },
      { status: 400 },
    );
  }

  try {
    const customers = await prisma.customer.findMany({
      where: {
        id: { in: payload.data.ids },
        sellerId: user.id,
      },
      select: { customerName: true },
    });

    if (customers.length === 0) {
      return NextResponse.json(
        { message: "No customers found to delete" },
        { status: 404 },
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.customer.deleteMany({
        where: {
          id: { in: payload.data.ids },
          sellerId: user.id,
        },
      });
      await tx.notification.create({
        data: {
          userId: user.id,
          type: NotificationType.CUSTOMER_DELETED,
        },
      });
    });

    return NextResponse.json(
      {
        message: `${payload.data.ids.length} customer(s) deleted successfully`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
});

export const GET = routeGuard(async (_, { user, searchParams }) => {
  const payload = paginatedQuerySchema.safeParse(searchParams);

  if (!payload.success) {
    return NextResponse.json(
      { message: "Invalid query parameters" },
      { status: 400 },
    );
  }
  const result = await getCustomers({
    userId: user.id,
    ...payload.data,
  });

  if (!result.success) {
    return NextResponse.json({ message: result.error }, { status: 500 });
  }

  return NextResponse.json(result.data);
});
