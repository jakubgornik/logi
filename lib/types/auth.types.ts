import { User } from "@prisma/client";
import { NextRequest } from "next/server";

export interface JWTPayload {
  userId: string;
  authId: string;
  email: string;
}

export interface AuthenticatedRouteContext<TParams = Record<string, string>> {
  user: User;
  params: TParams;
}

export type AuthenticatedHandler<TParams = Record<string, string>> = (
  req: NextRequest,
  context: AuthenticatedRouteContext<TParams>
) => Promise<Response> | Response;
