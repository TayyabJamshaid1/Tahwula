"use client";
import { Input } from "@/components/ui/input";
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Mail, UserCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleForgotPassword } from "@/lib/AuthActions";
import { ForgotPasswordSchema } from "@/app/api/auth/register.schema";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { forgotPasswordThunk } from "@/app/lib/AuthSlice";
import { useRouter } from "next/navigation";

const ForgotComponent: React.FC = () => {
  const authLoader: boolean = useAppSelector((s) => s.auth.authLoading);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const handleFormSubmit = async (data: any) => {
    const res: any = await dispatch(forgotPasswordThunk(data));

    if (forgotPasswordThunk.fulfilled.match(res)) {
      toast.success(res.payload.message);
      router.push("/login");
    } else {
      toast.error(res.payload || "Something went wrong");
    }
  };
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 sm:px-0  bg-[#1D3557] bg-cover bg-center"
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
      <Card className="w-full max-w-md">
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
            Enter your email to get mail{" "}
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

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#1D3557]  hover:bg-[#1D3557]/80"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  Sending Reset Link
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                </div>
              ) : (
                "Send Reset Link"
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?
                <Link
                  href="/login"
                  className="text-[#1D3557] hover:text-[#1D3557]/80 font-medium underline-offset-4 hover:underline"
                >
                  {" "}
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotComponent;
