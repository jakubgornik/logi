import { getCurrentUser } from "@/lib/fetchers/get-current-user";
import { ROUTES } from "@/lib/routes";
import { UserForm } from "@/modules/settings/user-form";
import { redirect } from "next/navigation";

export default async function UpdateUserPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.SIGN_IN);
  }

  return <UserForm user={user} />;
}
