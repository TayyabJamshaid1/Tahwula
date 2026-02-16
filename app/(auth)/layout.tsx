import { getCurrentUser } from "@/app/api/auth/auth-queries";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }:any) {
  const session = await getCurrentUser();

  if (session) {
    const role = session.userId.role;

    if (role === "admin") redirect("/admin/dashboard");
    if (role === "simpleUser") redirect("/simpleUser/dashboard");
  }

  return <>{children}</>;
}
