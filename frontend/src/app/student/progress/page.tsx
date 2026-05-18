"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { courseAPI, enrollmentAPI } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

const sidebarItems = [
  { label: "Dashboard", href: "/student/dashboard", icon: "📊" },
  { label: "Courses", href: "/student/courses", icon: "📚" },
  { label: "Progress", href: "/student/progress", icon: "📈" },
  { label: "Quizzes", href: "/student/quiz", icon: "❓" },
  { label: "Certificates", href: "/student/certificates", icon: "🏆" },
];

interface CourseProgress {
  id: number;
  title: string;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  lastAccessed: string;
}

export default function StudentProgressPage() {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setIsLoading(true);
        
        // Get all courses
        const allCourses = await courseAPI.getAll() as any[];
        
        // Get student enrollments
        if (user?.id) {
          const enrollments = await enrollmentAPI.getByStudent(user.id) as any[];
          
          // Map enrollments to course progress
          const progressData = enrollments.map((enrollment: any) => {
            const course = allCourses.find((c: any) => c.id === enrollment.courseId);
            const totalLessons = course?.modules?.reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0) || 0;
            const lessonsCompleted = Math.round((enrollment.progress / 100) * totalLessons);
            
            return {
              id: enrollment.courseId,
              title: course?.title || "Unknown Course",
              progress: Math.round(enrollment.progress || 0),
              lessonsCompleted: lessonsCompleted,
              totalLessons: totalLessons,
              lastAccessed: "Recently",
            };
          });
          
          setCourses(progressData);
        }
      } catch (err) {
        console.error("Error fetching progress data:", err);
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgressData();
  }, [user?.id]);

  const totalProgress = courses.length > 0 ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length) : 0;
  const totalLessonsCompleted = courses.reduce((sum, c) => sum + c.lessonsCompleted, 0);
  const totalLessons = courses.reduce((sum, c) => sum + c.totalLessons, 0);

  if (isLoading) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Your Learning Progress</h1>
          <p className="text-gray-600 mt-2">Track your course completion and learning journey</p>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">{totalProgress}%</p>
                <p className="text-blue-700 mt-2 font-medium">Overall Progress</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">{courses.length}</p>
                <p className="text-blue-700 mt-2 font-medium">Courses Enrolled</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-purple-600">{totalLessonsCompleted}</p>
                <p className="text-purple-700 mt-2 font-medium">Lessons Completed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-orange-600">{totalLessons - totalLessonsCompleted}</p>
                <p className="text-orange-700 mt-2 font-medium">Lessons Remaining</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Progress */}
        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-gray-900">Course Progress</CardTitle>
            <CardDescription className="text-gray-600">Your progress in each enrolled course</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {courses.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No courses enrolled yet. Start learning today!</p>
            ) : (
              courses.map((course) => (
                <div key={course.id} className="space-y-3 pb-6 border-b border-gray-100 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {course.lessonsCompleted} of {course.totalLessons} lessons completed
                      </p>
                    </div>
                    <span className="text-2xl font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{course.progress}%</span>
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

                  <p className="text-xs text-gray-500">Last accessed: {course.lastAccessed}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Learning Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-gray-900">Learning Streak</CardTitle>
              <CardDescription className="text-gray-600">Keep up your learning momentum</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <span className="text-gray-700 font-medium">Current Streak</span>
                  <span className="text-3xl font-bold text-orange-600">7 days</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-700 font-medium">Longest Streak</span>
                  <span className="text-2xl font-bold text-gray-900">15 days</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-gray-700 font-medium">Total Learning Days</span>
                  <span className="text-2xl font-bold text-blue-600">42 days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-gray-900">Time Spent Learning</CardTitle>
              <CardDescription className="text-gray-600">Your learning activity this week</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-gray-700 font-medium">This Week</span>
                  <span className="text-2xl font-bold text-blue-600">12.5 hours</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-gray-700 font-medium">This Month</span>
                  <span className="text-2xl font-bold text-blue-600">48 hours</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="text-gray-700 font-medium">Total Time</span>
                  <span className="text-2xl font-bold text-purple-600">156 hours</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-gray-900">Achievements</CardTitle>
            <CardDescription className="text-gray-600">Badges you have earned</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "🏆", title: "First Course", desc: "Completed your first course", color: "from-yellow-50 to-yellow-100 border-yellow-200" },
                { icon: "⭐", title: "Perfect Score", desc: "Got 100% on a quiz", color: "from-blue-50 to-blue-100 border-blue-200" },
                { icon: "🔥", title: "7-Day Streak", desc: "Learned 7 days in a row", color: "from-orange-50 to-orange-100 border-orange-200" },
                { icon: "📚", title: "Bookworm", desc: "Completed 5 courses", color: "from-purple-50 to-purple-100 border-purple-200" },
              ].map((achievement, index) => (
                <div key={index} className={`text-center p-4 bg-gradient-to-br ${achievement.color} rounded-lg border hover:shadow-md transition-shadow`}>
                  <p className="text-3xl mb-2">{achievement.icon}</p>
                  <p className="font-semibold text-gray-900 text-sm">{achievement.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{achievement.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
