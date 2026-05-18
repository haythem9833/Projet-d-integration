"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lesson, Module } from "@/lib/types";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

interface LessonDetail extends Lesson {
  module?: Module;
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/${lessonId}`, {
          headers: {
            Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
          },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch lesson");
        }
        
        const lessonData = await response.json();
        setLesson(lessonData);
      } catch (err) {
        console.error("Failed to fetch lesson:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId]);

  const handleProgressUpdate = (progressPercent: number) => {
    setProgress(progressPercent);
    
    if (progressPercent >= 90) {
      console.log("Lesson 90% watched - Mark as completed");
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </>
    );
  }

  if (!lesson) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <p className="text-gray-600">Lesson not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
            <Link href="/student/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <span>→</span>
            <Link href="/student/courses" className="hover:text-blue-600">Courses</Link>
            <span>→</span>
<button onClick={() => window.history.back()} className="hover:text-blue-600">
  Continuer
</button>            <span>→</span>
            <span className="text-gray-900 font-medium">{lesson.title}</span>
          </div>

          {/* Video Player */}
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <VideoPlayer
              videoUrl={lesson.videoUrl || ""}
              title={lesson.title}
              onProgress={handleProgressUpdate}
            />
          </div>

          {/* Lesson Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Lesson Info Card */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-3xl text-gray-900">{lesson.title}</CardTitle>
                      {lesson.module && (
                        <CardDescription className="text-gray-600 mt-2">
                          📚 Module: <span className="font-semibold text-gray-900">{lesson.module.title}</span>
                        </CardDescription>
                      )}
                    </div>
                    {progress >= 90 && (
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        ✓ Completed
                      </div>
                    )}
                  </div>
                </CardHeader>
              </Card>

              {/* Lesson Content */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">📖 Lesson Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                    <p className="whitespace-pre-wrap">{lesson.content}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Key Takeaways */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-900">💡 Key Takeaways</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Watch the entire video to mark the lesson as complete</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Take notes while watching to reinforce learning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Review the lesson content after watching</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Progress Card */}
              <Card className="bg-white border-gray-200 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">📊 Your Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Video Watched</span>
                      <span className="text-sm font-bold text-blue-600">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {progress >= 90 ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-700 font-semibold">
                        ✓ Lesson completed! Great job!
                      </p>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-700">
                        Watch {100 - Math.round(progress)}% more to complete
                      </p>
                    </div>
                  )}

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    📥 Download Resources
                  </Button>
                </CardContent>
              </Card>

              {/* Navigation Card */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">🧭 Navigation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-gray-200 text-gray-900 hover:bg-gray-50"
                    onClick={() => router.back()}
                  >
                    ← Go Back
                  </Button>
                  <Link href="/student/courses" className="block">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-gray-200 text-gray-900 hover:bg-gray-50"
                    >
                      📚 All Courses
                    </Button>
                  </Link>
                  <Link href="/student/dashboard" className="block">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-gray-200 text-gray-900 hover:bg-gray-50"
                    >
                      📊 Dashboard
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card className="bg-gray-50 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-sm text-gray-900">ℹ️ Lesson Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Duration</p>
                    <p className="font-semibold text-gray-900">~15 minutes</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Difficulty</p>
                    <p className="font-semibold text-gray-900">Beginner</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
