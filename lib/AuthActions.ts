"use client";

import { RegisterForm } from "@/app/(auth)/register/page";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

export const handleForgotPassword = async (formdata: { email: string }) => {
  try {
    const { email } = formdata;
    const res = await fetch(`${baseUrl}/api/auth/ForgotPassword`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });
    const data = await res.json();
    if (!data?.success) {
      return { success: false, message: data?.message };
    }
    return { success: true, message: data?.message };
  } catch (err) {
    return { success: false, message: "User Failed" };
  }
};
export const handleLoginSubmit = async (formdata: {
  password: string;
  email: string;
}) => {
  try {
    const { email, password } = formdata;

    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!data?.success) {
      return { success: false, message: data?.message };
    }
    return { success: true, message: data?.message, user: data?.user };
  } catch (err) {
    return { success: false, message: "User Failed" };
  }
};

export const handleLogout = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/auth/logout`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });

    const data = await res.json();

    if (!data?.success) {
      return { success: false, message: data?.message };
    }

    return { success: true, message: data?.message };
  } catch (err) {
    return { success: false, message: "User Logout Failed" };
  }
};
export const registerUser = async (formData: RegisterForm) => {
  try {
    const {
      email,
      password,
      confirmPassword,
      name,
      userName,
      phoneNumber,
    } = formData;

    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name,
        userName,
        confirmPassword,
        phoneNumber,
      }),
    });

    const data = await res.json();
    if (!data?.success) {
      return { success: false, message: data?.message };
    }
    return { success: true, message: data?.message,user: data?.user };
  } catch (err) {
    return { success: false, message: "User Registration Failed" };
  }
};
export const handleresetPassword = async (formdata: {
  token: string;
  password: string;
}) => {
  try {
    const { token, password } = formdata;

    const res = await fetch(`${baseUrl}/api/auth/ResetPassword`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        token,
        password,
      }),
    });

    const data = await res.json();

    if (!data?.success) {
      return { success: false, message: data?.message };
    }
    return { success: true, message: data?.message };
  } catch (err) {
    return { success: false, message: "User Reset Failed" };
  }
};
export const UserProfile = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/auth/UserProfileData`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });

    const data = await res.json();

    if (!data?.success) {
      return { success: false, message: data?.message };
    }

    return { success: true, message: data?.message,user:data?.user,profileData:data?.profileData };
  } catch (err) {
    return { success: false, message: "User Logout Failed" };
  }
};