"use client"; // CLIENT COMPONENT wrapper for client-side redirect

import { useAppSelector } from "@/app/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import UserSidebar from "../Components/User-Sidebar";

export default function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const currentUser = useAppSelector((s) => s.auth.user);

  // Client-side redirect after logout
  useEffect(() => {
    if (!currentUser) {
      router.replace("/login");
    } else if (currentUser.role !== "simpleUser") {
      router.replace("/");
    }
  }, [currentUser, router]);

  // Prevent rendering while redirecting
  if (!currentUser || currentUser.role !== "simpleUser") return null;

  return (
    <div className="min-h-screen bg-background">
      <UserSidebar>{children}</UserSidebar>
    </div>
  );
}