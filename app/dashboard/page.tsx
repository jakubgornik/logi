"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/use-logout";

export default function DashboardPage() {
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1> Dashboard</h1>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
