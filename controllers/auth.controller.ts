import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import {
  loginUserSchema,
  registerUserSchema,
} from "@/app/api/auth/register.schema";

import { ConnectToDatabase } from "@/lib/db";
import {
  fetchUsers,
  forgotPasswordService,
  loginService,
  logoutService,
  registerService,
  resetPasswordService,
  userProfileService,
} from "../services/auth.service";

export const loginController = async (request: NextRequest) => {
  try {
    await ConnectToDatabase();

    const body = await request.json();

    const parsed = loginUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0].message,
        },
        { status: 400 },
      );
    }

    const user = await loginService(parsed.data.email, parsed.data.password);

    return NextResponse.json(
      {
        success: true,
        user,
        message: "Login Successful",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Login Failed",
      },
      { status: 500 },
    );
  }
};

export const registerController = async (request: NextRequest) => {
  try {
    await ConnectToDatabase();

    const body = await request.json();

    const parsed = registerUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0].message,
        },
        { status: 400 },
      );
    }

    const user = await registerService(parsed.data);

    return NextResponse.json(
      {
        success: true,
        user,
        message: "User Registered Successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Registration Failed",
      },
      { status: 500 },
    );
  }
};

export const forgotPasswordController = async (request: NextRequest) => {
  try {
    await ConnectToDatabase();

    const { email } = await request.json();

    await forgotPasswordService(email);

    return NextResponse.json(
      {
        success: true,
        message: "Password reset email sent",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Password reset Failed",
      },
      { status: 500 },
    );
  }
};

export const resetPasswordController = async (request: NextRequest) => {
  try {
    await ConnectToDatabase();

    const { token, password } = await request.json();

    await resetPasswordService(token, password);

    return NextResponse.json(
      {
        success: true,
        message: "Password updated Successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Password update failed",
      },
      { status: 500 },
    );
  }
};

export const logoutController = async () => {
  try {
    await ConnectToDatabase();

    const cookieStore = await cookies();

    const session = cookieStore.get("session")?.value;

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Already logout or no session found",
        },
        { status: 400 },
      );
    }

    await logoutService(session);

    cookieStore.delete("session");

    return NextResponse.json(
      {
        success: true,
        message: "Successfully Logout",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Logout Failed",
      },
      { status: 500 },
    );
  }
};

export const userProfileController = async () => {
  try {
    await ConnectToDatabase();

    const cookieStore = await cookies();

    const session = cookieStore.get("session")?.value;

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const data = await userProfileService(session);

    return NextResponse.json(
      {
        success: true,
        message: "User fetched successfully",
        ...data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
};
export const fetchAllChatUsers = async () => {
  try {
    await ConnectToDatabase();

    let users = await fetchUsers();
    return NextResponse.json(
      {
        success: true,
        users,
        message: "All users fetched successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Fetch all users Failed",
      },
      { status: 500 },
    );
  }
};