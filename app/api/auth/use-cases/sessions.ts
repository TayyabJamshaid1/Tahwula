//Session k sath jab b kam krna tu below steps mei kam huta ha
//obtain the user id
//Generate the raw session token
//Retrieve user agent
//Retreive ip address

import { cookies, headers } from "next/headers";
import crypto from "crypto";
import { getIPAddress } from "./location";
import Session from "@/models/Session";
import { SESSION_LIFETIME, SESSION_REFRESH_TIME } from "@/lib/constant";
import "@/models/User";
import { ConnectToDatabase } from "@/lib/db";
type CreateSessionData = {
  token: string;
  userId: string;
  ip: string;
  userAgent: string;
};
const generateToken = () => {
  //crypto is used to generate token
  return crypto.randomBytes(32)?.toString("hex").normalize("NFC");
};
const createUserSession = async ({
  token,
  userId,
  ip,
  userAgent,
}: CreateSessionData) => {
  try {
    const sessionToken = crypto
      .createHash("sha-256")
      .update(token)
      .digest("hex");

    await ConnectToDatabase();

    await Session.create({
      userId,
      userAgent,
      ip,
      sessionToken,
      expiresAt: new Date(Date.now() + SESSION_LIFETIME * 1000),
    });

    return true;
  } catch (error: any) {
    console.error("❌ createUserSession error:", error?.message);

    // ❗ Do NOT throw → avoid crashing login flow
    return false;
  }
};

export const createSessionAndSetCookies = async (userId: string) => {
  try {
    const token = crypto.randomBytes(32).toString("hex");

    const ip = await getIPAddress();
    const headersList = await headers();

    const isSessionCreated = await createUserSession({
      token,
      userId,
      ip,
      userAgent: headersList.get("user-agent") || "",
    });

    // ❗ If DB failed → don't set cookie
    if (!isSessionCreated) {
      console.error("Session not created, skipping cookie set");
      return;
    }

    const cookieStore = await cookies();

    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_LIFETIME,
      sameSite: "lax",
      path: "/",
    });
  } catch (error: any) {
    console.error("❌ createSessionAndSetCookies error:", error?.message);
  }
};
export const validateSessionAndGetUser = async (session: string) => {
  try {
    // 🔐 Hash incoming session token
    const sessionToken = crypto
      .createHash("sha-256")
      .update(session)
      .digest("hex");

    await ConnectToDatabase();

    const sessionStoredUser = await Session.findOne({ sessionToken }).populate(
      "userId",
      "-password"
    );

    if (!sessionStoredUser) return null;

    const now = Date.now();
    const expiresAt = sessionStoredUser.expiresAt.getTime();

    // ⛔ Session expired
    if (now >= expiresAt) {
      await invalidateSession(sessionStoredUser._id.toString());
      return null;
    }

    // 🔄 Sliding expiration (refresh session)
    if (now >= expiresAt - SESSION_REFRESH_TIME * 1000) {
      await Session.findOneAndUpdate(
        { sessionToken },
        {
          expiresAt: new Date(
            Date.now() + SESSION_LIFETIME * 1000
          ),
        }
      );
    }

    return sessionStoredUser;
  } catch (error: any) {
    console.error("❌ validateSessionAndGetUser error:", error?.message);

    // ✅ CRITICAL: Prevent crash if DB/network fails
    return null;
  }
};

export const invalidateSession = async (sessionId: string) => {
  try {
    await ConnectToDatabase();
    await Session.findByIdAndDelete(sessionId);
  } catch (error) {
    console.error("❌ invalidateSession error:", error);
  }
};