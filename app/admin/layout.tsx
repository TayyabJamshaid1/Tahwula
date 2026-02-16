// import { getCurrentUser } from "@/app/api/auth/auth-queries";
// import { redirect } from "next/navigation";
// export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
//    const user = await getCurrentUser();
//     if (!user) return redirect("/login");
//     console.log(user,"user in employer");
    
//     if (user?.userId?.role !== "applicant")
//       return redirect("/Employers/Dashboard");
//   return (
// <div className="flex min-h-screen bg-background ">
//       <main className="container mx-auto mt-5 ml-70 mr-5">{children}</main>
//     </div>
//   );
// }
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
if (user.role !== "admin") redirect("/");

  return <>{children}</>;
}
