"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { lessonAPI } from "@/lib/api";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  ChartBarIcon,
  BookOpenIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const sidebarItems = [
  { label: "Dashboard", href: "/professor/dashboard", icon: <ChartBarIcon className="w-6 h-6" /> },
  { label: "My Courses", href: "/professor/courses", icon: <BookOpenIcon className="w-6 h-6" /> },
  { label: "Create Course", href: "/professor/courses/create", icon: <PlusIcon className="w-6 h-6" /> },
];

const lessonSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  videoUrl: z.string().url("Must be a valid URL"),
});

type LessonFormData = z.infer<typeof lessonSchema>;

export default function CreateLessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const moduleId = params.moduleId as string;
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
  });

  const onSubmit = async (data: LessonFormData) => {
    setIsLoading(true);
    try {
      await lessonAPI.create({
        title: data.title,
        content: data.content,
        videoUrl: data.videoUrl,
        moduleId: parseInt(moduleId),
      });
      success("Lesson with video created successfully!");
      router.push(`/professor/courses/${courseId}/modules`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create lesson";
      error(errorMessage);
      console.error("Error creating lesson:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Add Lesson with Video</h1>
          <p className="text-gray-600 mt-2">
            Create a new video lesson for your module
          </p>
        </div>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Create New Lesson</CardTitle>
            <CardDescription>Add a video lesson to your module</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Lesson Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-900 font-semibold">Lesson Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Introduction to React"
                  className="bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Video URL */}
              <div className="space-y-2">
                <Label htmlFor="videoUrl" className="text-gray-900 font-semibold">Video URL</Label>
                <Input
                  id="videoUrl"
                  placeholder="https://example.com/video.mp4"
                  className="bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                  {...register("videoUrl")}
                />
                <p className="text-sm text-gray-600">
                  Supported: YouTube, Vimeo, MP4, WebM, or any video URL
                </p>
                {errors.videoUrl && (
                  <p className="text-sm text-red-600">{errors.videoUrl.message}</p>
                )}
              </div>

              {/* Video URL Examples */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold mb-3 text-blue-900">📹 Video URL Examples:</p>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>
                    • <strong>YouTube:</strong>{" "}
                    <code className="bg-white border border-blue-200 px-2 py-1 rounded text-xs text-blue-600">
                      https://youtube.com/embed/VIDEO_ID
                    </code>
                  </li>
                  <li>
                    • <strong>Vimeo:</strong>{" "}
                    <code className="bg-white border border-blue-200 px-2 py-1 rounded text-xs text-blue-600">
                      https://vimeo.com/VIDEO_ID
                    </code>
                  </li>
                  <li>
                    • <strong>Direct MP4:</strong>{" "}
                    <code className="bg-white border border-blue-200 px-2 py-1 rounded text-xs text-blue-600">
                      https://example.com/video.mp4
                    </code>
                  </li>
                  <li>
                    • <strong>Test Video:</strong>{" "}
                    <code className="bg-white border border-blue-200 px-2 py-1 rounded text-xs text-blue-600">
                      https://www.w3schools.com/html/mov_bbb.mp4
                    </code>
                  </li>
                </ul>
              </div>

              {/* Lesson Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-gray-900 font-semibold">Lesson Description</Label>
                <textarea
                  id="content"
                  placeholder="Describe what students will learn in this lesson"
                  className="flex min-h-[150px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base text-gray-900 placeholder-gray-400"
                  {...register("content")}
                />
                {errors.content && (
                  <p className="text-sm text-red-600">{errors.content.message}</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                  {isLoading ? "Creating..." : "✅ Create Lesson"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1 border-gray-200 text-gray-900 hover:bg-gray-50"
                >
                  ❌ Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">How to Add Videos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-900 mb-2">📺 Option 1: YouTube</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                1. Go to YouTube and find your video<br />
                2. Click Share → Embed<br />
                3. Copy the URL from the iframe src attribute<br />
                4. Paste it in the Video URL field
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-gray-900 mb-2">💾 Option 2: Direct Video File</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                1. Upload your video to a hosting service (AWS S3, Vimeo, etc.)<br />
                2. Get the direct URL to the video file<br />
                3. Paste it in the Video URL field
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-gray-900 mb-2">🎬 Option 3: Vimeo</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                1. Upload your video to Vimeo<br />
                2. Get the video ID from the URL<br />
                3. Use format: https://vimeo.com/VIDEO_ID
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
