"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { courseAPI } from "@/lib/api";
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

const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  level: z.string().min(1, "Level is required"),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsFetching(true);
        const data = await courseAPI.getById(parseInt(courseId)) as any;
        reset({
          title: data.title,
          description: data.description,
          category: data.category,
          level: data.level,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch course";
        error(errorMessage);
        console.error("Error fetching course:", err);
      } finally {
        setIsFetching(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId, reset]);

  const onSubmit = async (data: CourseFormData) => {
    setIsLoading(true);
    try {
      await courseAPI.update(parseInt(courseId), data);
      success("Course updated successfully!");
      router.push("/professor/courses");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update course";
      error(errorMessage);
      console.error("Error updating course:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading course...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Edit Course</h1>
          <p className="text-gray-600 mt-2">Update your course information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
            <CardDescription>Edit your course information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Course Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., React Basics"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  placeholder="Describe your course"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-base"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("category")}
                >
                  <option value="">Select a category</option>
                  <option value="Programming">Programming</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category.message}</p>
                )}
              </div>

              {/* Level */}
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <select
                  id="level"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("level")}
                >
                  <option value="">Select a level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                {errors.level && (
                  <p className="text-sm text-red-500">{errors.level.message}</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  {isLoading ? "Updating..." : "✅ Update Course"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  ❌ Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
