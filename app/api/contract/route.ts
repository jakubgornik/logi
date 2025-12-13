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
