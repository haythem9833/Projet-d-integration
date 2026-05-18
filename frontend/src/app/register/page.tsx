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
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  role: z.enum(["STUDENT", "PROFESSOR"]),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const { setToken, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "STUDENT",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.register(data) as any;
      
      // Store token and user data
      if (response.token) {
        setToken(response.token);
        setUser(response.user);
      }
      
      // Only redirect students to payment, not professors/admins
      if (response.user?.role === "STUDENT") {
        success("Registration successful! Redirecting to payment...");
        
        // Redirect to payment page after a short delay
        setTimeout(() => {
          router.push("/payment");
        }, 1500);
      } else {
        // Professors and admins go directly to dashboard
        success("Registration successful! Redirecting to dashboard...");
        
        setTimeout(() => {
          router.push("/professor/dashboard");
        }, 1500);
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      const errorMessage = err?.message || "Registration failed. Please try again.";
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
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Create a new e-learning account
            </CardDescription>
          </CardHeader>
          <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                {...register("role")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="STUDENT">Student</option>
                <option value="PROFESSOR">Professor</option>
              </select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </div>
        </CardContent>
      </Card>
      </div>
    </>
  );
}
