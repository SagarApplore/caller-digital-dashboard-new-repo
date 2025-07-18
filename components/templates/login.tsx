"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "../organisms/card";
import { Label } from "../atoms/label";
import { Input } from "../atoms/input";
import { useAuth } from "../providers/auth-provider";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const success = await login(data.email, data.password, data.rememberMe);
      if (success) {
        router.push("/");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#6a29c422] to-[#00b4d82b] flex items-center justify-center p-4">
      <div className="flex flex-col items-center justify-between h-[95vh] overflow-y-scroll">
        <div></div>

        <div className="flex flex-col items-center justify-center gap-4 w-full  max-w-[500px]">
          {/* Header */}
          <div className="flex flex-col items-center justify-center gap-2 pointer-events-none select-none">
            <div className="p-2 bg-white/90 backdrop-blur-sm w-fit rounded-xl border border-white/30 shadow-lg">
              <div className="w-12 h-12">
                <img src="/caller-digital-logo.svg" alt="Caller Digital Logo" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-[#4b5563b2] text-sm">
              Sign in to your AI-powered CX platform
            </p>
          </div>

          {/* Card */}
          <Card className="w-full bg-white/70 backdrop-blur-md shadow-lg border border-white/20">
            <CardContent className="p-6">
              {/* Form */}
              <form
                className="gap-4 flex flex-col"
                onSubmit={handleSubmit(onSubmit)}
              >
                {/* Email Field */}
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className=" flex flex-col gap-1">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...register("password")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setValue("rememberMe", checked as boolean)
                      }
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </Label>
                  </div>
                  <Button
                    variant="link"
                    className="text-sm text-purple-600 hover:text-purple-700 p-0 h-auto"
                  >
                    Forgot password?
                  </Button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
                    {error}
                  </div>
                )}

                {/* Sign In Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-2.5 rounded-md font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing In...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <img src="/exit.svg" alt="Sign In" />
                      <span>Sign In</span>
                    </div>
                  )}
                </Button>
              </form>

              {/* Divider */}
              {/* <div className="my-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white/70 backdrop-blur-md text-gray-500 rounded">
                      Or continue with
                    </span>
                  </div>
                </div>
              </div> */}

              {/* Social Login Buttons */}
              {/* <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="flex items-center justify-center space-x-2 py-2.5 border-gray-300 hover:bg-gray-50 bg-transparent"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-gray-700">Google</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center space-x-2 py-2.5 border-gray-300 hover:bg-gray-50 bg-transparent"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#00A4EF"
                      d="M0 0h11.377v11.372H0V0zm12.623 0H24v11.372H12.623V0zM0 12.623h11.377V24H0V12.623zm12.623 0H24V24H12.623V12.623z"
                    />
                  </svg>
                  <span className="text-gray-700">Microsoft</span>
                </Button>
              </div> */}

              {/* Contact Sales */}
              {/* <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  {"Don't have an account? "}
                  <Button
                    variant="link"
                    className="text-purple-600 hover:text-purple-700 p-0 h-auto font-medium"
                  >
                    Contact Sales
                  </Button>
                </p>
              </div> */}
            </CardContent>
          </Card>

          {/* Feature Tags */}
          <div className="mt-2 flex justify-center space-x-4">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <img src="/call.svg" alt="Call" />
              <span>Voice AI</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <img src="/chat.svg" alt="Chat" />
              <span>Chat Automation</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <img src="/mail.svg" alt="Email" />
              <span>Email Intelligence</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>
            © 2024 Caller.Digital. All rights reserved. |{" "}
            <Button variant="link" className="text-xs text-gray-500 p-0 h-auto">
              Privacy Policy
            </Button>{" "}
            |{" "}
            <Button variant="link" className="text-xs text-gray-500 p-0 h-auto">
              Terms of Service
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
