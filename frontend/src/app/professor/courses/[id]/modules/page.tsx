"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { moduleAPI } from "@/lib/api";
import { DashboardLayout } from "@/components/DashboardLayout";

const sidebarItems = [
  { label: "Dashboard", href: "/professor/dashboard", icon: "📊" },
  { label: "My Courses", href: "/professor/courses", icon: "📚" },
  { label: "Create Course", href: "/professor/courses/create", icon: "➕" },
];

const moduleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type ModuleFormData = z.infer<typeof moduleSchema>;

export default function ManageModulesPage() {
  const params = useParams();
  const courseId = params.id as string;
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [modules, setModules] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [deletingModuleId, setDeletingModuleId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema),
  });

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setIsFetching(true);
        const data = await moduleAPI.getByCourse(parseInt(courseId)) as any[];
        setModules(data || []);
      } catch (err) {
        console.error("Error fetching modules:", err);
        setModules([]);
      } finally {
        setIsFetching(false);
      }
    };

    if (courseId) {
      fetchModules();
    }
  }, [courseId]);

  const onSubmit = async (data: ModuleFormData) => {
    setIsLoading(true);
    try {
      const newModule = await moduleAPI.create({
        title: data.title,
        description: data.description,
        courseId: parseInt(courseId),
      });
      setModules([...modules, newModule]);
      success("Module created successfully!");
      reset();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create module";
      error(errorMessage);
      console.error("Error creating module:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteModule = async (moduleId: number) => {
    if (!confirm("Are you sure you want to delete this module? This will also delete all lessons in this module.")) {
      return;
    }

    setDeletingModuleId(moduleId);
    try {
      await moduleAPI.delete(moduleId);
      setModules(modules.filter(m => m.id !== moduleId));
      success("Module deleted successfully!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete module";
      error(errorMessage);
      console.error("Error deleting module:", err);
    } finally {
      setDeletingModuleId(null);
    }
  };

  if (isFetching) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-400">Loading modules...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="space-y-8">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white shadow-lg">
          <h1 className="text-4xl font-bold">Manage Modules</h1>
          <p className="text-blue-100 mt-2">Course ID: {courseId}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Module Form */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-gray-200 sticky top-24 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <CardTitle className="text-gray-900 text-xl">➕ Create Module</CardTitle>
                <CardDescription className="text-gray-600">Add a new module to your course</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-gray-700 font-semibold">Module Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Module 1: Basics"
                      className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                      {...register("title")}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-600 font-medium">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-700 font-semibold">Description</Label>
                    <textarea
                      id="description"
                      placeholder="Describe this module"
                      className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                      {...register("description")}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-600 font-medium">{errors.description.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md" disabled={isLoading}>
                    {isLoading ? "Creating..." : "✅ Create Module"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Modules List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {modules.length === 0 ? (
                <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 shadow-sm">
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-600 text-lg">📭 No modules yet. Create one to get started!</p>
                  </CardContent>
                </Card>
              ) : (
                modules.map((module, index) => (
                  <Card key={module.id} className="bg-white border-2 border-gray-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-gray-900 text-xl">{module.title}</CardTitle>
                            <CardDescription className="text-gray-600 mt-1">{module.description}</CardDescription>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDeleteModule(module.id)}
                          disabled={deletingModuleId === module.id}
                          variant="destructive"
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white flex-shrink-0"
                        >
                          {deletingModuleId === module.id ? "Deleting..." : "🗑️ Delete"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {/* Lessons Section */}
                        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                          <p className="text-sm font-bold text-purple-900 mb-3">
                            📚 Lessons ({module.lessons?.length || 0})
                          </p>
                          {module.lessons && module.lessons.length === 0 ? (
                            <p className="text-sm text-purple-700 italic">No lessons yet</p>
                          ) : (
                            <ul className="space-y-2">
                              {module.lessons?.map((lesson: any, lessonIndex: number) => (
                                <li key={lesson.id} className="text-sm text-purple-800 flex items-center gap-2 bg-white p-2 rounded border border-purple-200">
                                  <span>🎥</span>
                                  <span className="font-medium">{lessonIndex + 1}. {lesson.title}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                          <Link href={`/professor/courses/${courseId}/modules/${module.id}/lessons`} className="block">
                            <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-md">
                              ➕ Add Lesson with Video
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
