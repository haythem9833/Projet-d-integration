"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { courseAPI } from "@/lib/api";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";

import {
  ChartBarIcon,
  BookOpenIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const sidebarItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <ChartBarIcon className="w-6 h-6" /> },
  { label: "All Courses", href: "/admin/courses", icon: <BookOpenIcon className="w-6 h-6" /> },
  { label: "Users", href: "/admin/users", icon: <UsersIcon className="w-6 h-6" /> },
  // { label: "Reports", href: "/admin/reports", icon: <ArrowTrendingUpIcon className="w-6 h-6" /> },
  { label: "Settings", href: "/admin/settings", icon: <Cog6ToothIcon className="w-6 h-6" /> },
];

const CATEGORIES = ["Development", "Data Science", "Design", "Business", "Marketing"];
const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"];

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  trainer?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  modules?: any[];
  enrollments?: any[];
}

export default function AdminCoursesPage() {
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
      const matchesInstructor = 
        course.trainer?.firstName.toLowerCase().includes(query) ||
        course.trainer?.lastName.toLowerCase().includes(query);
      
      const matchesCategory = !selectedCategory || course.category === selectedCategory;
      const matchesLevel = !selectedLevel || course.level === selectedLevel;
      
      return (matchesTitle || matchesDescription || matchesInstructor) && matchesCategory && matchesLevel;
    });
    setFilteredCourses(filtered);
  }, [searchQuery, courses, selectedCategory, selectedLevel]);

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">All Courses</h1>
          <p className="text-gray-600 mt-2">Manage and monitor all courses on the platform</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Total Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">{courses.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Total Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-emerald-600">
                {courses.reduce((sum, c) => sum + (c.modules?.length || 0), 0)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Total Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-teal-600">
                {courses.reduce((sum, c) => sum + (c.enrollments?.length || 0), 0)}
              </p>
            </CardContent>
          </Card>
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

        {/* Courses Table */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Courses List</h2>
          {isLoading ? (
            <Card className="bg-white border-gray-200">
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">Loading courses...</p>
              </CardContent>
            </Card>
          ) : filteredCourses.length === 0 ? (
            <Card className="bg-white border-gray-200">
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">
                  {searchQuery || selectedCategory || selectedLevel
                    ? "No courses match your filters"
                    : "No courses available"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Title</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Instructor</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Category</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Level</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900">Modules</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900">Students</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourses.map((course) => (
                        <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-semibold text-gray-900">{course.title}</p>
                              <p className="text-sm text-gray-600">{course.description}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            {course.trainer ? (
                              <span>{course.trainer.firstName} {course.trainer.lastName}</span>
                            ) : (
                              <span className="text-gray-400">Unknown</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                              {course.category}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                              {course.level}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="font-semibold text-gray-900">{course.modules?.length || 0}</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="font-semibold text-gray-900">{course.enrollments?.length || 0}</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Link href={`/admin/courses/${course.id}`}>
                              <Button variant="outline" size="sm" className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50">
                                View
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
