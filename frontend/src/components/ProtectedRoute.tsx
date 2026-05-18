"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles: string[];
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    
    if (!token || !user) {
      router.push("/login");
      return;
    }

    // Check if user has required role
    if (requiredRoles.includes(user.role)) {
      setIsAuthorized(true);
    } else {
      // Redirect to appropriate dashboard based on role
      if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (user.role === "PROFESSOR" || user.role === "TRAINER") {
        router.push("/professor/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    }

    setIsLoading(false);
  }, [user, requiredRoles, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Access Denied</p>
          <p className="text-sm text-gray-500">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
