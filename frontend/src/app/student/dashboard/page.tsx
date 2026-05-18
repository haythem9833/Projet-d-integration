"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { enrollmentAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  ChartBarIcon,
  BookOpenIcon,
  BookmarkIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

const sidebarItems = [
  { label: "Dashboard", href: "/student/dashboard", icon: <ChartBarIcon className="w-6 h-6" /> },
  { label: "Courses", href: "/student/courses", icon: <BookOpenIcon className="w-6 h-6" /> },
  { label: "My Courses", href: "/student/my-courses", icon: <BookmarkIcon className="w-6 h-6" /> },
  { label: "Certificates", href: "/student/certificates", icon: <TrophyIcon className="w-6 h-6" /> },
];

interface EnrolledCourse {
  id: number;
  courseId: number;
  courseTitle: string;
  courseDescription: string;
  courseCategory: string;
  courseLevel: string;
  progress: number;
}

function StudentDashboardContent() {
  const { user } = useAuthStore();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const data = await enrollmentAPI.getMyCourses() as EnrolledCourse[];
        setEnrolledCourses(data);
      } catch (err) {
        console.error("Failed to fetch enrolled courses:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  const totalProgress = enrolledCourses.length > 0 
    ? Math.round(enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length) 
    : 0;

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.firstName}! 👋</p>
          </div>
          <Link href="/student/courses">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
              🔍 Browse Courses
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="text-green-900 text-sm">My Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">{enrolledCourses.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900 text-sm">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">{totalProgress}%</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
            <CardHeader>
              <CardTitle className="text-teal-900 text-sm">Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-teal-600">0</p>
            </CardContent>
          </Card>
        </div>

        {/* My Courses Progress */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-gray-900">Course Progress</CardTitle>
            <CardDescription className="text-gray-600">Your progress in enrolled courses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {isLoading ? (
              <p className="text-gray-600 text-center py-8">Loading your courses...</p>
            ) : enrolledCourses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
                <Link href="/student/courses">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Browse Courses
                  </Button>
                </Link>
              </div>
            ) : (
              enrolledCourses.map((course) => (
                <div key={course.id} className="space-y-3 pb-6 border-b border-gray-100 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{course.courseTitle}</h3>
                      <p className="text-sm text-gray-600 mt-1">{course.courseCategory} • {course.courseLevel}</p>
                    </div>
                    <span className="text-2xl font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg ml-4">
                      {Math.round(course.progress)}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        course.progress >= 80
                          ? "bg-gradient-to-r from-blue-500 to-emerald-500"
                          : course.progress >= 50
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                          : "bg-gradient-to-r from-orange-500 to-yellow-500"
                      }`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <Link href={`/student/courses/${course.courseId}`}>
                      <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                        Continue Learning →
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default function StudentDashboard() {
  return (
    <ProtectedRoute requiredRoles={["STUDENT"]}>
      <StudentDashboardContent />
    </ProtectedRoute>
  );
}
