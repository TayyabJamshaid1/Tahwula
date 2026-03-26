"use client";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signIn } from "next-auth/react";

import { Eye, EyeOff, Lock, Mail, User, UserCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserSchema } from "@/app/api/auth/register.schema";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { loginThunk } from "@/app/lib/AuthSlice";
import Image from "next/image";

const LoginComponent: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const authLoader: boolean = useAppSelector((s) => s.auth.authLoading);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginUserSchema),
  });
  const router = useRouter();

  const handleFormSubmit = async (data: any) => {
    const res = await dispatch(loginThunk(data)).unwrap();
    console.log(res, "ressss in login");

    if (res?.success) {
      toast.success(res?.message);
      console.log(res, "res");

      if (res?.user?.role == "simpleUser") {
        router.replace("/simpleUser/dashboard");
      }
    } else {
      toast.error(res?.message);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#1D3557] flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/IconBackgroundAuth.png')" }}
    >
      {authLoader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            {/* Spinner */}
            <div className="h-17 w-17 rounded-full border-6 border-[#1D3557] border-t-transparent animate-spin"></div>
          </div>
        </div>
      )}
      <Card className="w-full max-w-lg">
        <CardHeader className="w-full text-center flex flex-col items-center ">
          <Image
            src="/logo.png"
            alt="Employers Dashboard Logo"
            width={100}
            height={40}
            className="h-auto w-auto " // Makes white logo if your logo is dark
            priority
          />
          <CardTitle className="text-2xl text-[#1D3557]">
            Welcome to the Namken Digital Transformation System
          </CardTitle>
          <CardDescription className="text-[#1D3557]">
            Login your account to get started
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#1D3557]">
                Email Address *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  {...register("email")}
                  // onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  //   handleChangeEvent("email", e.target.value);
                  // }}
                  className={`pl-10 ${
                    errors.email ? "border-destructive" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#1D3557]">
                Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  required
                  {...register("password")}
                  // onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  //   handleChangeEvent("password", e.target.value);
                  // }}
                  className={`pl-10 pr-10 ${
                    errors.password ? "border-destructive" : ""
                  }`}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#1D3557]  hover:bg-[#1D3557]/80 mb-2"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  Logging in account...
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                </div>
              ) : (
                "Login Account"
              )}
            </Button>

            <div className="text-center mb-2">
              <p className="text-sm text-muted-foreground">
                Dont have an account?
                <Link
                  href="/register"
                  className="text-[#1D3557] hover:text-[#1D3557]/80 font-medium underline-offset-4 hover:underline"
                >
                  {" "}
                  Register here
                </Link>
              </p>
            </div>
            <div className="w-full flex flex-col sm:flex-row gap-2 sm:justify-center items-center">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-1/2 flex gap-2 text-[#1D3557]"
                onClick={() =>
                  signIn("google", { callbackUrl: "/simpleUser/dashboard" })
                }
              >
                <img src="/googleIcon.png" alt="google" className="w-4 h-4" />
                Continue with Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-1/2 flex gap-2 text-[#1D3557]"
                onClick={() =>
                  signIn("github", { callbackUrl: "/simpleUser/dashboard" })
                }
              >
                <img src="/githubIcon.png" className="w-4 h-4" />
                Continue with GitHub
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Forgot your password?
                <Link
                  href="/forgotPassword"
                  className="hover:text-primary/80 font-medium underline-offset-4 hover:underline text-[#1D3557]"
                >
                  {" "}
                  Click here
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginComponent;
