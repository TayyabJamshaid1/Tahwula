import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";
import Session from "@/models/Session";
import { invalidateSession } from "../use-cases/sessions";

export async function GET() {
  try {
    console.log('in server function called');
    
    const cookiesData = await cookies();
    let session = cookiesData.get("session")?.value;
        console.log('in server function cookiees ',session);

    if (!session)
      return NextResponse.json({
        success: false,
        message: "Already logout or no session found",
        status: 400,
      });
    const sessionToken = crypto
      .createHash("sha-256")
      .update(session)
      .digest("hex");
    const sessionStoredUser = await Session.findOne({ sessionToken });
    await invalidateSession(sessionStoredUser._id.toString());
    cookiesData.delete("session");
return NextResponse.json(
      {
        success: true,
      message: "Successfully Logout",
      },
      { status: 200 }
    );
    
   
  } catch (error) {
     return NextResponse.json(
          { success: false, message: "Logout Failed" },
          { status: 500 }
        );
  }
}
