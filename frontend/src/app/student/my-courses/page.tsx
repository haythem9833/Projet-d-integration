"use client";

import { useEffect, useState } from "react";
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
  enrolledAt: string;
}

function MyCoursesContent() {
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

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600 mt-2">Manage your enrolled courses</p>
          </div>
          <Link href="/student/courses">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
              + Enroll in New Course
            </Button>
          </Link>
        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-600">Loading your courses...</p>
          </div>
        ) : enrolledCourses.length === 0 ? (
          <Card className="bg-white border-gray-200">
            <CardContent className="p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">You haven't enrolled in any courses yet.</p>
              <Link href="/student/courses">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Browse Available Courses
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <Card key={course.id} className="bg-white border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-gray-900 text-lg">{course.courseTitle}</CardTitle>
                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {Math.round(course.progress)}%
                    </span>
                  </div>
                  <CardDescription className="text-gray-600">{course.courseDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Category:</strong> {course.courseCategory}</p>
                      <p><strong>Level:</strong> {course.courseLevel}</p>
                      <p><strong>Enrolled:</strong> {new Date(course.enrolledAt).toLocaleDateString()}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>

                    <Link href={`/student/courses/${course.courseId}`} className="w-full">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Continue Learning →
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function MyCoursesPage() {
  return (
    <ProtectedRoute requiredRoles={["STUDENT"]}>
      <MyCoursesContent />
    </ProtectedRoute>
  );
}
