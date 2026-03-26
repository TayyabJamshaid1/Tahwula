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

const ForgotComponent: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const handleFormSubmit = async (data: any) => {
    const res = await handleForgotPassword(data);
    if (res?.success) {
      toast.success(res?.message);
    } else {
      toast.error(res?.message);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#1D3557] flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/IconBackgroundAuth.png')" }}
    >
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
            <Button type="submit" className="w-full bg-[#1D3557]  hover:bg-[#1D3557]/80">
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
