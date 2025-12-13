import { routeGuard } from "@/lib/auth";
import { getContracts } from "@/lib/fetchers/get-contracts";
import { prisma } from "@/lib/prisma";
import { paginatedQuerySchema } from "@/lib/types/common.types";
import { contractApiSchema } from "@/modules/contract/contract-form.validation";
import { NextRequest, NextResponse } from "next/server";

export const GET = routeGuard(async (_, { user, searchParams }) => {
  const payload = paginatedQuerySchema.safeParse(searchParams);

  if (!payload.success) {
    return NextResponse.json(
      {
        message: "Invalid query parameters",
      },
      { status: 400 }
    );
  }

  const result = await getContracts({
    userId: user.id,
    ...payload.data,
  });

  if (!result.success) {
    return NextResponse.json({ message: result.error }, { status: 500 });
  }

  return NextResponse.json(result.data);
});

export const POST = routeGuard(async (request: NextRequest, { user }) => {
  const payload = contractApiSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json(
      {
        message: "Invalid data",
      },
      { status: 400 }
    );
  }

  try {
    const [contractUser, contractSupplier] = await Promise.all([
      prisma.user.findUnique({
        where: { id: user.id },
        select: { scopes: true },
      }),
      prisma.supplier.findUnique({
        where: { id: payload.data.supplierId },
        select: { scopes: true },
      }),
    ]);

    if (!contractUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!contractSupplier) {
      return NextResponse.json(
        { message: "Supplier not found" },
        { status: 404 }
      );
    }

    const hasMatchingScope = contractUser.scopes.some((scope) =>
      contractSupplier.scopes.includes(scope)
    );

    if (!hasMatchingScope) {
      return NextResponse.json(
        {
          message:
            "Cannot create contract: User and supplier have no common capabilities",
        },
        { status: 403 }
      );
    }

    await prisma.contract.create({
      data: {
        ...payload.data,
        userId: user.id,
      },
    });

    return NextResponse.json(
      { message: "Contract created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
});
