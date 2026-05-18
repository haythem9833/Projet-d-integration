"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/DashboardLayout";

import {
  ChartBarIcon,
  BookOpenIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const sidebarItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <ChartBarIcon className="w-6 h-6" /> },
  { label: "All Courses", href: "/admin/courses", icon: <BookOpenIcon className="w-6 h-6" /> },
  { label: "Users", href: "/admin/users", icon: <UsersIcon className="w-6 h-6" /> },
  // { label: "Reports", href: "/admin/reports", icon: <ArrowTrendingUpIcon className="w-6 h-6" /> },
  { label: "Settings", href: "/admin/settings", icon: <Cog6ToothIcon className="w-6 h-6" /> },
];

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { error, success } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        
        console.log("Fetching users with token:", token ? "present" : "missing");
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users`, {
          headers: {
            Authorization: `Bearer ${token || ""}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (e) {
            // If response is not JSON, use the default message
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log("Users fetched successfully:", data);
        setUsers(data || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch users";
        error(errorMessage);
        console.error("Error fetching users:", err);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(userId);
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token || ""}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use the default message
        }
        throw new Error(errorMessage);
      }

      // Remove user from list
      setUsers(users.filter((u) => u.id !== userId));
      success(`User ${userName} deleted successfully!`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete user";
      error(errorMessage);
      console.error("Error deleting user:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "PROFESSOR":
      case "TRAINER":
        return "bg-blue-100 text-blue-800";
      case "STUDENT":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading users...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-2">Manage all users in the platform</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users ({filteredUsers.length})</CardTitle>
            <CardDescription>Total users in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No users found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 font-semibold">Role</th>
                      <th className="text-left py-3 px-4 font-semibold">Joined</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id, `${user.firstName} ${user.lastName}`)}
                            disabled={deletingId === user.id}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            {deletingId === user.id ? "Deleting..." : "Delete"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{users.length}</p>
                <p className="text-gray-600 mt-2">Total Users</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {users.filter((u) => u.role === "STUDENT").length}
                </p>
                <p className="text-gray-600 mt-2">Students</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {users.filter((u) => u.role === "PROFESSOR" || u.role === "TRAINER").length}
                </p>
                <p className="text-gray-600 mt-2">Professors</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">
                  {users.filter((u) => u.role === "ADMIN").length}
                </p>
                <p className="text-gray-600 mt-2">Admins</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
