import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }:any) {
  const session = await getCurrentUser();

  if (session) {
    const role = session.role;

    if (role === "admin") redirect("/admin/dashboard");
    if (role === "simpleUser") redirect("/simpleUser/dashboard");
  }

  return <>{children}</>;
}
