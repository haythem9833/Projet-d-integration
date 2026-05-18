"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

const CATEGORIES = ["Web Development", "Mobile Development", "Data Science", "AI/ML", "Cloud Computing", "DevOps", "Other"];
const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

export default function CreateCoursePage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      category: "Web Development",
      level: "Beginner",
    },
  });

  const onSubmit = async (data: CourseFormData) => {
    setIsLoading(true);
    try {
      await courseAPI.create(data);
      success("Course created successfully!");
      router.push("/professor/dashboard");
    } catch (err: any) {
      console.error("Create course error:", err);
      const errorMessage = err?.message || "Failed to create course";
      error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-gray-600 mt-2">Fill in the details to create a new course</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
            <CardDescription>
              Provide all required information for your course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Introduction to React"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  placeholder="Describe what students will learn in this course"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("category")}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category.message}</p>
                )}
              </div>

              {/* Level */}
              <div className="space-y-2">
                <Label htmlFor="level">Level *</Label>
                <select
                  id="level"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("level")}
                >
                  {LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
                {errors.level && (
                  <p className="text-sm text-red-500">{errors.level.message}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  {isLoading ? "Creating..." : "✅ Create Course"}
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

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>Course Creation Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">📝 Title</h4>
              <p className="text-sm text-gray-600">
                Use a clear, descriptive title that tells students what they'll learn.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">📖 Description</h4>
              <p className="text-sm text-gray-600">
                Provide a detailed description of the course content and learning outcomes.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">🏷️ Category & Level</h4>
              <p className="text-sm text-gray-600">
                Choose the appropriate category and difficulty level to help students find your course.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
