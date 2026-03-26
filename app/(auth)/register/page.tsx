"use client";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, User, UserCheck } from "lucide-react";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { registerUserWithConfirmSchema } from "@/app/api/auth/register.schema";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { registerThunk } from "@/app/lib/AuthSlice";
import Image from "next/image";
export interface RegisterForm {
  name: string;
  userName: string;
  email: string;
  password: string;
  phoneNumber: string;
  confirmPassword: string;
}
const RegisterComponet: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerUserWithConfirmSchema),
  });
  const dispatch = useAppDispatch();
  const authLoader: boolean = useAppSelector((s) => s.auth.authLoading);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: RegisterForm) => {
    const res = await dispatch(registerThunk(data)).unwrap();
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
            Create your account to get started
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Name Field */}
            <div className="space-y-2">
              <Label className="text-[#1D3557]" htmlFor="name">
                Full Name *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  {...register("name")}
                  // onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  //   handleChangeEvent("name", e.target.value);
                  // }}
                  className={`pl-10 ${errors.name ? "border-destructive" : ""}`}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <Label className="text-[#1D3557]" htmlFor="userName">
                Username *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="userName"
                  type="text"
                  placeholder="Choose a username"
                  required
                  {...register("userName")}
                  // onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  //   handleChangeEvent("userName", e.target.value);
                  // }}
                  className={`pl-10 ${
                    errors.userName ? "border-destructive" : ""
                  }`}
                />
              </div>
              {errors.userName && (
                <p className="text-sm text-destructive">
                  {errors.userName.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label className="text-[#1D3557]" htmlFor="email">
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
            {/* Phone Field */}
            <div className="space-y-2">
              <Label className="text-[#1D3557]" htmlFor="phoneNumber">
                Phone Number *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phoneNumber"
                  type="text"
                  placeholder="Enter your phone number"
                  required
                  {...register("phoneNumber")}
                  // onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  //   handleChangeEvent("phoneNumber", e.target.value);
                  // }}
                  className={`pl-10 ${
                    errors.phoneNumber ? "border-destructive" : ""
                  }`}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-sm text-destructive">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label className="text-[#1D3557]" htmlFor="password">
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

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label className="text-[#1D3557]" htmlFor="confirmPassword">
                Confirm Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  // name="confirmPassword"
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  required
                  // onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  //   handleChangeEvent("confirmPassword", e.target.value);
                  // }}
                  className={`pl-10 pr-10 ${
                    errors.confirmPassword ? "border-destructive" : ""
                  }`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            {/* <Button type="submit" disabled={authStatus === "loading"}>
  {authStatus === "loading" ? "Creating account..." : "Create Account"}
</Button> */}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full  bg-[#1D3557]  hover:bg-[#1D3557]/80"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  Creating account...
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                </div>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?
                <Link
                  href="/login"
                  className=" hover:text-primary/80 font-medium underline-offset-4 hover:underline text-[#1D3557]"
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

export default RegisterComponet;
