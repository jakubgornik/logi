import { routeGuard } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { contractApiSchema } from "@/modules/contract/contract-form.validation";
import { NextRequest, NextResponse } from "next/server";

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
        status: "ACTIVE",
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
