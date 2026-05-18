"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { courseAPI } from "@/lib/api";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import {
  ChartBarIcon,
  BookOpenIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const sidebarItems = [
  { label: "Dashboard", href: "/professor/dashboard", icon: <ChartBarIcon className="w-6 h-6" /> },
  { label: "All Courses", href: "/professor/all-courses", icon: <BookOpenIcon className="w-6 h-6" /> },
  { label: "My Courses", href: "/professor/courses", icon: <PencilIcon className="w-6 h-6" /> },
  { label: "Create Course", href: "/professor/courses/create", icon: <PlusIcon className="w-6 h-6" /> },
];

const CATEGORIES = ["Development", "Data Science", "Design", "Business", "Marketing"];
const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"];

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  professor?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  modules?: any[];
  enrollments?: any[];
}

export default function ProfessorCoursesPage() {
  const { error } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const data = await courseAPI.getAll() as Course[];
        
        // Filter courses created by the current professor
        // In a real app, you'd filter by professor ID from the token
        setCourses(data || []);
        setFilteredCourses(data || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch courses";
        error(errorMessage);
        console.error("Error fetching courses:", err);
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on search query, category, and level
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = courses.filter((course) => {
      const matchesTitle = course.title.toLowerCase().includes(query);
      const matchesDescription = course.description?.toLowerCase().includes(query);
      
      const matchesCategory = !selectedCategory || course.category === selectedCategory;
      const matchesLevel = !selectedLevel || course.level === selectedLevel;
      
      return (matchesTitle || matchesDescription) && matchesCategory && matchesLevel;
    });
    setFilteredCourses(filtered);
  }, [searchQuery, courses, selectedCategory, selectedLevel]);

  if (isLoading) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600 mt-2">Manage and view all your courses</p>
          </div>
          <Link href="/professor/courses/create">
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <PlusIcon className="w-5 h-5" />
              Create New Course
            </Button>
          </Link>
        </div>

        {/* Search Bar and Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-0 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-lg font-medium text-gray-900 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedLevel || ""}
              onChange={(e) => setSelectedLevel(e.target.value || null)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-lg font-medium text-gray-900 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">All Levels</option>
              {DIFFICULTY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full">
              <Card className="bg-white border-gray-200">
                <CardContent className="p-12 text-center">
                  <p className="text-gray-600 mb-4">
                    {searchQuery || selectedCategory || selectedLevel
                      ? "No courses match your filters"
                      : "No courses yet. Create your first course to get started!"}
                  </p>
                  {!searchQuery && !selectedCategory && !selectedLevel && (
                    <Link href="/professor/courses/create">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Create Your First Course
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="line-clamp-2 text-gray-900">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-gray-600">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Course Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-semibold text-gray-900">{course.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Level:</span>
                      <span className="font-semibold text-gray-900">{course.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Modules:</span>
                      <span className="font-semibold text-gray-900">{course.modules?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Students:</span>
                      <span className="font-semibold text-gray-900">{course.enrollments?.length || 0}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <Link href={`/professor/courses/${course.id}/modules`} className="block">
                      <Button variant="outline" className="w-full justify-start bg-white border-blue-200 text-blue-700 hover:bg-blue-50">
                        📚 Manage Modules
                      </Button>
                    </Link>
                    <Link href={`/professor/courses/${course.id}/edit`} className="block">
                      <Button variant="outline" className="w-full justify-start bg-white border-blue-200 text-blue-700 hover:bg-blue-50">
                        ✏️ Edit Course
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
