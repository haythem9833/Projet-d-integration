"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { courseAPI } from "@/lib/api";
import { DashboardLayout } from "@/components/DashboardLayout";

const sidebarItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
  { label: "All Courses", href: "/admin/courses", icon: "📚" },
  { label: "Users", href: "/admin/users", icon: "👥" },
  { label: "Reports", href: "/admin/reports", icon: "📈" },
];

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  price?: number;
  trainer?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  modules?: Module[];
  enrollments?: Enrollment[];
}

interface Module {
  id: number;
  title: string;
  description?: string;
  lessons?: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  content?: string;
  videoUrl?: string;
}

interface Enrollment {
  id: number;
  studentId: number;
  progress: number;
}

export default function AdminCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const { error, success } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const data = await courseAPI.getById(parseInt(courseId)) as Course;
        setCourse(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch course";
        error(errorMessage);
        console.error("Error fetching course:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const [openModuleId, setOpenModuleId] = useState<number | null>(null);
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      await courseAPI.delete(parseInt(courseId));
      success("Course deleted successfully!");
      router.push("/admin/courses");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete course";
      error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading course...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-600 text-lg mb-4">Course not found</p>
            <Link href="/admin/courses">
              <Button className="bg-green-600 hover:bg-green-700">
                Back to Courses
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalLessons = course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;
  const totalEnrollments = course.enrollments?.length || 0;
  const avgProgress = course.enrollments && course.enrollments.length > 0
    ? Math.round(course.enrollments.reduce((sum, e) => sum + e.progress, 0) / course.enrollments.length)
    : 0;

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <Link href="/admin/courses" className="text-green-600 hover:text-green-700 text-sm font-medium mb-2 inline-block">
              ← Back to Courses
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600 mt-2">{course.description}</p>
          </div>
          <Button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete Course
          </Button>
        </div>

        {/* Course Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 text-sm">Category</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{course.category}</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 text-sm">Level</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-600">{course.level}</p>
            </CardContent>
          </Card>


          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 text-sm">Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{course.modules?.length || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Trainer Info */}
        {course.trainer && (
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-gray-900">👨‍🏫 Trainer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold text-gray-900">{course.trainer.firstName} {course.trainer.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold text-gray-900">{course.trainer.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Total Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600">{totalLessons}</p>
              <p className="text-sm text-gray-600 mt-2">Across {course.modules?.length || 0} modules</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Total Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-emerald-600">{totalEnrollments}</p>
              <p className="text-sm text-gray-600 mt-2">Active students</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Average Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-teal-600">{avgProgress}%</p>
              <p className="text-sm text-gray-600 mt-2">Student completion rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Modules Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 Course Modules</h2>
          {course.modules && course.modules.length > 0 ? (
            <div className="space-y-4">
              {course.modules.map((module, moduleIndex) => (
                <Card key={module.id} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                        {moduleIndex + 1}
                      </div>
                      <div>
                        <CardTitle className="text-gray-900">{module.title}</CardTitle>
                        {module.description && (
                          <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p
                        className="text-sm text-gray-600 cursor-pointer select-none"
                        onClick={() =>
                          setOpenModuleId(openModuleId === module.id ? null : module.id)
                        }
                      >
                        <span className="font-semibold">
                          {module.lessons?.length || 0}
                        </span>{" "}
                        lessons ▼
                      </p>

                      {openModuleId === module.id && module.lessons && module.lessons.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="text-sm p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-lg">🎬</span>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">
                                    {lessonIndex + 1}. {lesson.title}
                                  </p>
                                  {lesson.videoUrl && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Video: {lesson.videoUrl.substring(0, 50)}...
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {openModuleId === module.id &&
                        (!module.lessons || module.lessons.length === 0) && (
                          <p className="text-sm text-gray-500 italic">
                            No lessons in this module
                          </p>
                        )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white border-gray-200">
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">No modules in this course</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Enrollments Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">👥 Student Enrollments</h2>
          {course.enrollments && course.enrollments.length > 0 ? (
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Student ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Progress</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.enrollments.map((enrollment) => (
                        <tr key={enrollment.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="py-4 px-4 text-gray-900">#{enrollment.studentId}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-600 h-2 rounded-full"
                                  style={{ width: `${enrollment.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900">{enrollment.progress}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              enrollment.progress >= 100
                                ? "bg-green-100 text-green-700"
                                : enrollment.progress >= 50
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}>
                              {enrollment.progress >= 100 ? "Completed" : enrollment.progress >= 50 ? "In Progress" : "Started"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white border-gray-200">
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">No enrollments yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
