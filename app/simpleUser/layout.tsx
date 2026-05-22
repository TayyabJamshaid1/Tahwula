// "use client";

// import { useAppSelector } from "@/app/lib/hooks";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import UserSidebar from "../Components/User-Sidebar";

// export default function ApplicantLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const currentUser = useAppSelector((s) => s.auth.user);
//   const authLoading = useAppSelector((s) => s.auth.authLoading);

//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     if (!authLoading && mounted) {
//       if (!currentUser) {
//         router.replace("/login");
//       } else if (currentUser.role !== "simpleUser") {
//         router.replace("/");
//       }
//     }
//   }, [currentUser, authLoading, mounted, router]);

//   // Prevent flicker on logout / mount
//   if (!mounted || !currentUser) return null;

//   return (
//     <div className="min-h-screen bg-background">
//       <UserSidebar>{children}</UserSidebar>
//     </div>
//   );
// }
export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import UserSidebar from "@/components/User-Sidebar";

export default async function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/login");
  if (currentUser.role !== "simpleUser") redirect("/");

  return (
    <div className="min-h-screen bg-background">
      <UserSidebar>
        {children}
      </UserSidebar>
    </div>
  );
}