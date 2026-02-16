

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/models/User";
import { ConnectToDatabase } from "@/lib/db";
import { sendResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    await ConnectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.resetPasswordToken = token;
    user.resetPasswordExpiry = expiry;
    await user.save();
console.log(user,'user');

    const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`;

    await sendResetEmail(email, resetLink);
console.log(resetLink,'resetLink');
 return NextResponse.json(
      {
        success: true,
      message: "Password reset email sent",
      },
      { status: 200 }
    );
    
  } catch (error) {
 return NextResponse.json(
      { success: false, message: "Password reset Failed" },
      { status: 500 }
    );  }
}
