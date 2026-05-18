"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { LandingPage } from "@/components/LandingPage";

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated() && user) {
      // Rediriger basé sur le rôle
      const role = user.role;
      if (role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (role === "PROFESSOR" || role === "TRAINER") {
        router.push("/professor/dashboard");
      } else if (role === "STUDENT") {
        router.push("/student/dashboard");
      }
    }
  }, [user, isAuthenticated, router]);

  // Si non authentifié, afficher la landing page
  if (!isAuthenticated()) {
    return <LandingPage />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">E-Learning Platform</h1>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
