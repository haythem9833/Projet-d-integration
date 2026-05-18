"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { courseAPI } from "@/lib/api";
import { Course } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  ChartBarIcon,
  BookOpenIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const sidebarItems = [
  { label: "Dashboard", href: "/professor/dashboard", icon: <ChartBarIcon className="w-6 h-6" /> },
  { label: "All Courses", href: "/professor/all-courses", icon: <BookOpenIcon className="w-6 h-6" /> },
  { label: "My Courses", href: "/professor/courses", icon: <PencilIcon className="w-6 h-6" /> },
  { label: "Create Course", href: "/professor/courses/create", icon: <PlusIcon className="w-6 h-6" /> },
];

function ProfessorDashboardContent() {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseAPI.getAll() as Course[];
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Professor Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.firstName}! 👋</p>
          </div>
          <Link href="/professor/courses/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 flex items-center gap-2">
              <PlusIcon className="w-5 h-5" />
              Create Course
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="text-green-900">Total Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">{courses.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardHeader>
              <CardTitle className="text-emerald-900">Total Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-emerald-600">
                {courses.reduce((sum, c) => sum + (c.modules?.length || 0), 0)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
            <CardHeader>
              <CardTitle className="text-teal-900">Total Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-teal-600">
                {courses.reduce((sum, c) => sum + (c.enrollments?.length || 0), 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Courses */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Courses</h2>
          {isLoading ? (
            <Card className="bg-white border-gray-200">
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">Loading courses...</p>
              </CardContent>
            </Card>
          ) : courses.length === 0 ? (
            <Card className="bg-white border-gray-200">
              <CardContent className="p-8 text-center">
                <p className="text-gray-600 mb-4">No courses yet. Create your first course!</p>
                <Link href="/professor/courses/create">
                  <Button className="bg-blue-600 hover:bg-blue-700">Create Course</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow bg-white border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <p>📚 Modules: {course.modules?.length || 0}</p>
                      <p>👥 Enrollments: {course.enrollments?.length || 0}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/professor/courses/${course.id}/modules`} className="flex-1">
                        <Button variant="outline" className="w-full bg-white border-blue-200 text-blue-700 hover:bg-blue-50">
                          Manage Modules
                        </Button>
                      </Link>
                      <Link href={`/professor/courses/${course.id}/edit`} className="flex-1">
                        <Button variant="outline" className="w-full bg-white border-blue-200 text-blue-700 hover:bg-blue-50">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function ProfessorDashboard() {
  return (
    <ProtectedRoute requiredRoles={["PROFESSOR", "TRAINER"]}>
      <ProfessorDashboardContent />
    </ProtectedRoute>
  );
}
