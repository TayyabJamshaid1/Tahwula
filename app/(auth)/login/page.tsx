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
import { useAppDispatch } from "@/app/lib/hooks";
import { loginThunk } from "@/app/lib/AuthSlice";

const LoginComponent: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();

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
console.log(res,"ressss in login");

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
          <CardDescription>Login your account to get started</CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
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

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  Logging in account...
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                </div>
              ) : (
                "Login Account"
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Dont have an account?
                <Link
                  href="/register"
                  className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
                >
                  Register here
                </Link>
              </p>
            </div>
<Button
  type="button"
  variant="outline"
  className="w-full flex gap-2"
  onClick={() => signIn("google", { callbackUrl: "/simpleUser/dashboard" })}
>
  <img src="/google.svg" alt="google" className="w-4 h-4" />
  Continue with Google
</Button>
<Button
  type="button"
  variant="outline"
  className="w-full flex gap-2"
  onClick={() => signIn("github", { callbackUrl: "/simpleUser/dashboard" })}
>
  <img src="/github.svg" className="w-4 h-4" />
  Continue with GitHub
</Button>


            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Forgot your password?
                <Link
                  href="/forgotPassword"
                  className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
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
