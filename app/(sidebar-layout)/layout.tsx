import { getCurrentUser } from "@/lib/fetchers/get-current-user";
import { ROUTES } from "@/lib/routes";
import { redirect } from "next/navigation";
import ReactQueryProvider from "../react-query.provider";
import SidebarLayout from "./sidebar-layout";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.SIGN_IN);
  }

  return (
    <ReactQueryProvider userId={user.id}>
      <SidebarLayout>{children}</SidebarLayout>
    </ReactQueryProvider>
  );
}
