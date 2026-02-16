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
  const authStatus = useAppSelector((s) => s.auth.status);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: RegisterForm) => {
    const res = await dispatch(registerThunk(data)).unwrap();

    toast.success(res.message);
    console.log(res, "res");

    if (res?.user?.role === "simpleUser") {
      router.push("/simpleUser/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {isSubmitting && (
        <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
      )}

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <UserCheck className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Join Our Job Portal</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
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
              <Label htmlFor="userName">Username *</Label>
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
              <Label htmlFor="email">Email Address *</Label>
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
              <Label htmlFor="phoneNumber">Phone Number *</Label>
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
              <Label htmlFor="password">Password *</Label>
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
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
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
                  className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
                >
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
