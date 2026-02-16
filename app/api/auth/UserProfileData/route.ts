import { NextResponse } from "next/server";
import { ConnectToDatabase } from "@/lib/db";
import { cookies } from "next/headers";
import { validateSessionAndGetUser } from "../use-cases/sessions";
import User from "@/models/User";

export async function GET(): Promise<Response> {
  try {
    await ConnectToDatabase();

    const cookieStore = await cookies(); // ✅ REQUIRED in Next 16
    const session = cookieStore.get("session")?.value;

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await validateSessionAndGetUser(session);
    let profileData = null;

      profileData = await User.findOne({
        userId: user.userId._id.toString(),
      });
  
console.log(profileData,"sssssssssssssss",user,user.userId._id.toString());

    return NextResponse.json({
      success: true,
      message: "User fetched successfully",
      user,
      profileData,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
