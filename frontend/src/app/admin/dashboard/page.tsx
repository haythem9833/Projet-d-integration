"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { courseAPI, userAPI } from "@/lib/api";
import { Course } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  ChartBarIcon,
  BookOpenIcon,
  UsersIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const sidebarItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <ChartBarIcon className="w-6 h-6" /> },
  { label: "All Courses", href: "/admin/courses", icon: <BookOpenIcon className="w-6 h-6" /> },
  { label: "Users", href: "/admin/users", icon: <UsersIcon className="w-6 h-6" /> },
  // { label: "Reports", href: "/admin/reports", icon: <ArrowTrendingUpIcon className="w-6 h-6" /> },
  { label: "Settings", href: "/admin/settings", icon: <Cog6ToothIcon className="w-6 h-6" /> },
];

function AdminDashboardContent() {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState({ totalCourses: 0, totalUsers: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, usersData] = await Promise.all([
          courseAPI.getAll() as Promise<Course[]>,
          userAPI.getAllUsers() as Promise<any[]>
        ]);
        
        setCourses(coursesData);
        setStats({
          totalCourses: coursesData.length,
          totalUsers: usersData.length,
        });
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome, {user?.firstName}! 👋</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Total Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">{stats.totalCourses}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardHeader>
              <CardTitle className="text-emerald-900">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-emerald-600">{stats.totalUsers}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
            <CardHeader>
              <CardTitle className="text-teal-900">Active Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-teal-600">0</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-lime-50 to-lime-100 border-lime-200">
            <CardHeader>
              <CardTitle className="text-lime-900">Certificates Issued</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-lime-600">0</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Courses */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Courses</h2>
          {isLoading ? (
            <Card className="bg-white border-gray-200">
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">Loading...</p>
              </CardContent>
            </Card>
          ) : courses.length === 0 ? (
            <Card className="bg-white border-gray-200">
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">No courses yet</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {courses.slice(0, 5).map((course) => (
                    <div
                      key={course.id}
                      className="flex justify-between items-center border-b border-gray-200 pb-4 last:border-b-0"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{course.title}</p>
                        <p className="text-sm text-gray-600">{course.description}</p>
                      </div>
                      <Link href={`/admin/courses/${course.id}`}>
                        <Button variant="outline" className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50">View</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRoles={["ADMIN"]}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
