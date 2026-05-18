"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { quizAPI } from "@/lib/api";
import { DashboardLayout } from "@/components/DashboardLayout";

const sidebarItems = [
  { label: "Dashboard", href: "/student/dashboard", icon: "📊" },
  { label: "Courses", href: "/student/courses", icon: "📚" },
  { label: "Certificates", href: "/student/certificates", icon: "🏆" },
];

interface Quiz {
  id: number;
  title: string;
  courseId?: number;
}

export default function StudentQuizzesPage() {
  const { error } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        console.log("Fetching quizzes from API...");
        const data = await quizAPI.getAll() as Quiz[];
        console.log("Quizzes fetched:", data);
        setQuizzes(data || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch quizzes";
        console.error("Error fetching quizzes:", err);
        setErrorMessage(errorMessage);
        error(errorMessage);
        setQuizzes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading quizzes...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Available Quizzes</h1>
          <p className="text-gray-600 mt-2">Test your knowledge with our quizzes</p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <p className="text-red-700 font-medium">⚠️ {errorMessage}</p>
            </CardContent>
          </Card>
        )}

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.length === 0 ? (
            <div className="col-span-full">
              <Card className="bg-white border-gray-200">
                <CardContent className="p-12 text-center">
                  <p className="text-4xl mb-4">❓</p>
                  <p className="text-gray-900 font-semibold text-lg">No Quizzes Available</p>
                  <p className="text-gray-600 mt-2">Check back later for new quizzes!</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            quizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow bg-white border-gray-200 overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                <CardHeader className="pb-3">
                  <CardTitle className="line-clamp-2 text-gray-900">{quiz.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Quiz Info */}
                  <div className="space-y-2 text-sm">
                    {quiz.courseId && (
                      <div className="flex justify-between p-2 bg-blue-50 rounded border border-blue-200">
                        <span className="text-gray-600 font-medium">Course ID:</span>
                        <span className="font-semibold text-blue-600">{quiz.courseId}</span>
                      </div>
                    )}
                    <div className="flex justify-between p-2 bg-gray-50 rounded border border-gray-200">
                      <span className="text-gray-600 font-medium">Quiz ID:</span>
                      <span className="font-semibold text-gray-900">{quiz.id}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link href={`/student/quiz/${quiz.id}`} className="block">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      ▶️ Take Quiz
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
