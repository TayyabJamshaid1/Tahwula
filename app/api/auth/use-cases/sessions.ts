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
  userId: number;
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

    let data = await Session.create({
      userId,
      userAgent,
      ip,
      expiresAt: new Date(Date.now() + SESSION_LIFETIME * 1000),
      sessionToken,
    });
  } catch (err) {
    console.log(err, "err in create user sessuib");
  }
};

export const createSessionAndSetCookies = async (userId: number) => {
  const token = generateToken();

  const ip = await getIPAddress();

  const headersList = await headers();

  await createUserSession({
    token,
    userId,
    ip,
    userAgent: headersList.get("user-agent") || "",
  });
  const cookiesStore = await cookies();
  cookiesStore.set("session", token, {
    secure: true, //it ensures that cookie is only sent over https
    maxAge: SESSION_LIFETIME,
    httpOnly: true, //Prevents client side javascript access (like you cannot access cookies by using js methods like cookies.get etc)
  });
};

export const validateSessionAndGetUser = async (session: string) => {
  const sessionToken = crypto
    .createHash("sha-256")
    .update(session)
    .digest("hex");
  await ConnectToDatabase();
  const sessionStoredUser = await Session.findOne({ sessionToken }).populate(
    "userId",
    "-password"
  );
  console.log(sessionStoredUser, " sessionStored");

  if (!sessionStoredUser) return null;
  //if user using website after 30 days,then we will make him logout and session will be deleted
  if (Date.now() >= sessionStoredUser?.expiresAt.getTime()) {
    await invalidateSession(sessionStoredUser?._id.toString());
    return null;
  }
  //if user access the website before 30 days complete,after 15 days of logged in,now his 15 days are left,then we will give him more 30 days relaxation ,now he will be still logged in  for 45 days(30+15=45).
  if (
    Date.now() >=
    sessionStoredUser?.expiresAt.getTime() - SESSION_REFRESH_TIME * 1000
  ) {
    await Session.findOneAndUpdate(
      { sessionToken },
      { expiresAt: new Date(Date.now() + SESSION_LIFETIME * 1000) }
    );
  }
  return sessionStoredUser;
};


export const invalidateSession = async (sessionId: string) => {
  await ConnectToDatabase();

  await Session.findByIdAndDelete(sessionId);
};
