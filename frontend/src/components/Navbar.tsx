"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function Navbar() {
  const router = useRouter();
  const { user, logout, token } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    // Check both user object and token from localStorage
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const hasAuth = user !== null || token !== null || storedToken !== null;
    setIsAuthenticated(hasAuth);
  }, [user, token]);

  // Listen for storage changes (logout from other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      const storedToken = localStorage.getItem("token");
      setIsAuthenticated(storedToken !== null);
      if (!storedToken) {
        // If token was removed, redirect to login
        router.push("/login");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [router]);

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setIsOpen(false);
    // Force a hard redirect to login
    window.location.href = "/login";
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      case "PROFESSOR":
      case "TRAINER":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "STUDENT":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-gradient-to-r from-white via-blue-50 to-white border-b border-blue-200 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-2xl">🎓</div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-emerald-700 transition">
              EduStream
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-3 px-4 py-2 bg-blue-100 rounded-lg border border-blue-200">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                    {user?.firstName?.charAt(0) || "U"}{user?.lastName?.charAt(0) || ""}
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 font-semibold text-sm">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : "Utilisateur"}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full inline-block ${getRoleColor(user?.role)}`}>
                      {user?.role || "USER"}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <Button
  onClick={handleLogout}
  className="bg-gray-200 hover:bg-gray-300 text-gray-800 border-0"
>
  logout
</Button>
              </>
            ) : (
              <>
                {/* Login/Signup Buttons (only when not connected) */}
                <Link href="/login">
                  <Button variant="outline" className="border-blue-300 hover:bg-blue-100 text-gray-900">
                    Connexion
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Inscription
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-900 hover:text-blue-600 transition p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-blue-200 pt-4 space-y-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 bg-blue-100 rounded-lg border border-blue-200">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                    {user?.firstName?.charAt(0) || "U"}{user?.lastName?.charAt(0) || ""}
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold text-sm">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : "Utilisateur"}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full inline-block ${getRoleColor(user?.role)}`}>
                      {user?.role || "USER"}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white border-0"
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                {/* Login/Signup Buttons Mobile (only when not connected) */}
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full border-blue-300 hover:bg-blue-100 text-gray-900">
                    login
                  </Button>
                </Link>
                <Link href="/register" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
