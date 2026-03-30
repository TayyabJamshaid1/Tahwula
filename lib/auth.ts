import { cookies } from "next/headers";
import { validateSessionAndGetUser } from "@/app/api/auth/use-cases/sessions";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    if (!session) return null;

    const sessionData = await validateSessionAndGetUser(session);

    if (!sessionData) return null;

    return {
      id: sessionData.userId._id.toString(),
      role: sessionData.userId.role,
      email: sessionData.userId.email,
      name: sessionData.userId.name,
    };
  } catch (error) {
    console.error("❌ getCurrentUser error:", error);
    return null;
  }
}