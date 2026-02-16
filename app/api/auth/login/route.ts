import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ConnectToDatabase } from "@/lib/db";
import { createSessionAndSetCookies } from "../use-cases/sessions";
import { loginUserSchema } from "../register.schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = loginUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    await ConnectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid Email or Password" },
        { status: 400 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid Email or Password" },
        { status: 400 }
      );
    }

    await createSessionAndSetCookies(user._id.toString());

    return NextResponse.json(
      {
        success: true,
        user,
        message: "Login Successful",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Login Failed" },
      { status: 500 }
    );
  }
}
