"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth";
import { authAPI } from "@/lib/api";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const { setToken, setUser, checkSubscription } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(data.email, data.password) as any;
      console.log("Login response:", response);
      
      // Vérifier si la réponse contient un token
      if (response.token) {
        setToken(response.token);
        // Récupérer les infos utilisateur
        if (response.user) {
          setUser(response.user);
        }
        success("Login successful!");

        // Check user role
        const userRole = response.user?.role;

        // Professors and Admins go directly to dashboard
        if (userRole === "PROFESSOR" || userRole === "TRAINER" || userRole === "ADMIN") {
          if (userRole === "ADMIN") {
            router.push("/admin/dashboard");
          } else {
            router.push("/professor/dashboard");
          }
        } else if (userRole === "STUDENT") {
          // Students: check if they have active subscription
          const hasSubscription = await checkSubscription();
          
          if (hasSubscription) {
            // Redirect to dashboard if has subscription
            router.push("/student/dashboard");
          } else {
            // Redirect to payment page if no subscription (only once)
            router.push("/payment");
          }
        }
      } else {
        error("Login failed: No token received");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      const errorMessage = err?.message || "Login failed. Please check your credentials.";
      error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-100 pt-20">
        <Card className="w-full max-w-md bg-white border-gray-200">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Sign in to your e-learning account
            </CardDescription>
          </CardHeader>
          <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </div>
        </CardContent>
      </Card>
      </div>
    </>
  );
}
