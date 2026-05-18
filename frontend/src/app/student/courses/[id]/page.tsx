"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { courseAPI, enrollmentAPI } from "@/lib/api";
import { Course } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

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

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error } = useToast();
  const courseId = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [openModuleId, setOpenModuleId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await courseAPI.getById(parseInt(courseId)) as Course;
        setCourse(data);

        // Check if already enrolled
        const enrolled = await enrollmentAPI.checkEnrollment(parseInt(courseId));
        setIsEnrolled(enrolled);
      } catch (err) {
        console.error("Failed to fetch course:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      await enrollmentAPI.enroll(parseInt(courseId));
      success("Successfully enrolled in course!");
      setIsEnrolled(true);
      router.push("/student/my-courses");
    } catch (err: any) {
      error(err.message || "Failed to enroll in course");
    } finally {
      setIsEnrolling(false);
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
          <p className="text-gray-600">Course not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="space-y-8">
        {/* Header with gradient background */}
        <div className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-8 text-white shadow-lg">
          <h1 className="text-4xl font-bold">{course.title}</h1>
          <p className="text-green-100 mt-2 text-lg">{course.description}</p>
          <div className="mt-4 flex items-center gap-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{course.category}</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{course.level}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-gray-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
                <CardTitle className="text-gray-900 text-2xl">📚 Course Modules</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {!isEnrolled ? (
                  /* Enrollment Required Message */
                  <div className="text-center py-12 space-y-6">
                    <div className="flex justify-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-5xl">🔒</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-gray-900">Enroll to View Content</h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        You need to enroll in this course to access modules and lessons.
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
                        onClick={handleEnroll}
                        disabled={isEnrolling}
                      >
                        {isEnrolling ? "Enrolling..." : "🎓 Enroll Now"}
                      </Button>
                      <p className="text-sm text-gray-500">
                        {course.modules?.length || 0} modules • {course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0} lessons
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Course Content - Only for Enrolled Students */
                  <div className="space-y-3">
                    {course.modules && course.modules.length > 0 ? (
                      course.modules.map((module) => (
                        <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          {/* Module Header - Clickable */}
                          <div
                            className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 cursor-pointer hover:from-green-100 hover:to-emerald-100 transition-colors flex items-center justify-between"
                            onClick={() =>
                              setOpenModuleId(openModuleId === module.id ? null : module.id)
                            }
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">📦</span>
                              <div>
                                <h3 className="font-semibold text-gray-900">{module.title}</h3>
                                <p className="text-sm text-gray-600">{module.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded-full">
                                {module.lessons?.length || 0} lessons
                              </span>
                              <span className={`text-lg transition-transform ${openModuleId === module.id ? 'rotate-180' : ''}`}>
                                ▼
                              </span>
                            </div>
                          </div>

                          {/* Lessons List - Expandable */}
                          {openModuleId === module.id && (
                            <div className="bg-white border-t border-gray-200 p-4 space-y-4">
                              {/* Lessons */}
                              {module.lessons && module.lessons.length > 0 ? (
                                <div className="space-y-2">
                                  {module.lessons.map((lesson, lessonIndex) => (
                                    <Link key={lesson.id} href={`/student/lesson/${lesson.id}`}>
                                      <div className="p-3 hover:bg-green-50 rounded-lg cursor-pointer transition-colors flex items-center gap-3 border border-gray-100 hover:border-green-300">
                                        <span className="text-lg">🎬</span>
                                        <div className="flex-1">
                                          <p className="font-medium text-gray-900">
                                            {lessonIndex + 1}. {lesson.title}
                                          </p>
                                          <p className="text-sm text-gray-600">{lesson.content}</p>
                                        </div>
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded whitespace-nowrap">
                                          View
                                        </span>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500 italic py-2">No lessons yet</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No modules available for this course</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="bg-white border-gray-200 shadow-md sticky top-24">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
                <CardTitle className="text-gray-900 text-xl">📋 Course Info</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Instructor */}
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Instructor</p>
                  {course.trainer ? (
                    <p className="font-bold text-gray-900 mt-2 text-lg">
                      {course.trainer.firstName} {course.trainer.lastName}
                    </p>
                  ) : (
                    <p className="font-semibold text-gray-500 mt-2">Unknown</p>
                  )}
                </div>

                {/* Modules Count */}
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Modules</p>
                  <p className="font-bold text-gray-900 text-3xl mt-2">{course.modules?.length || 0}</p>
                </div>

                {/* Total Lessons */}
                <div className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg border border-teal-200">
                  <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide">Total Lessons</p>
                  <p className="font-bold text-gray-900 text-3xl mt-2">
                    {course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0}
                  </p>
                </div>

                {/* Enrollment Status / Button */}
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  {isEnrolled ? (
                    <>
                      <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Status</p>
                      <p className="font-bold text-green-600 mt-2 text-lg">✓ Enrolled</p>
                      <Link href="/student/my-courses" className="w-full mt-3">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          Continue Learning →
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Enrollment</p>
                      <Button
                        className="w-full mt-3 bg-green-600 hover:bg-green-700"
                        onClick={handleEnroll}
                        disabled={isEnrolling}
                      >
                        {isEnrolling ? "Enrolling..." : "Enroll in Course"}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
