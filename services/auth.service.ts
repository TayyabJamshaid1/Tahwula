import User from "@/models/User";
import Session from "@/models/Session";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import mongoose from "mongoose";

import { sendResetEmail } from "@/lib/email";
import { createSessionAndSetCookies, invalidateSession, validateSessionAndGetUser } from "@/app/api/auth/use-cases/sessions";

export const loginService = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid Email or Password");
  }

  const isValidPassword = await bcrypt.compare(
    password,
    user.password
  );

  if (!isValidPassword) {
    throw new Error("Invalid Email or Password");
  }
  await createSessionAndSetCookies(user._id.toString());
  return user;
};

export const registerService = async (data: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      email,
      password,
      phoneNumber,
      userName,
      name,
    } = data;

    const alreadyEmailRegistered = await User.findOne({
      email,
    });

    const alreadyUsernameRegistered = await User.findOne({
      userName,
    });

    if (alreadyEmailRegistered) {
      throw new Error(
        "User already Registered with this email"
      );
    }

    if (alreadyUsernameRegistered) {
      throw new Error(
        "User already Registered with this username"
      );
    }

    const user = await User.create({
      email,
      password,
      phoneNumber,
      name,
      userName,
      role: "simpleUser",
    });

    await createSessionAndSetCookies(
      user._id.toString()
    );

    await session.commitTransaction();

    return user;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const forgotPasswordService = async (
  email: string
) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const token = crypto
    .randomBytes(32)
    .toString("hex");

  const expiry = new Date(
    Date.now() + 15 * 60 * 1000
  );

  user.resetPasswordToken = token;
  user.resetPasswordExpiry = expiry;
  await user.save();
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
  await sendResetEmail(email, resetLink);
  return true;
};

export const resetPasswordService = async (
  token: string,
  password: string
) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpiry: {
      $gt: new Date(),
    },
  });

  if (!user) {
    throw new Error("Invalid or expired token");
  }

  user.password = password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;

  await user.save();

  return true;
};

export const logoutService = async (
  session: string
) => {
  const sessionToken = crypto
    .createHash("sha-256")
    .update(session)
    .digest("hex");

  const sessionStoredUser =
    await Session.findOne({
      sessionToken,
    });

  if (!sessionStoredUser) {
    throw new Error("Session not found");
  }

  await invalidateSession(
    sessionStoredUser._id.toString()
  );

  return true;
};

export const userProfileService = async (
  session: string
) => {
  const user =
    await validateSessionAndGetUser(session);

  const profileData = await User.findOne({
    userId: user.userId._id.toString(),
  });

  return {
    user,
    profileData,
  };
};

export const fetchUsers=async()=>{
    const users=await User.find({}).select("-password");
    return users;
}