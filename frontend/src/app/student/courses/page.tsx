"use client";

import { useEffect, useState } from "react";
import { courseAPI } from "@/lib/api";
import { Course } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";

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
const CATEGORIES = ["Development", "Data Science", "Design", "Business", "Marketing"];
const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseAPI.getAll() as Course[];
        setCourses(data);
        setFilteredCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
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
          <h1 className="text-4xl font-bold text-gray-900">Available Courses</h1>
          <p className="text-gray-600 mt-2">Explore and enroll in courses to start learning</p>
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

          {searchQuery && (
            <p className="text-sm text-gray-600">
              Found {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center h-96">
              <p className="text-gray-600">Loading courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="col-span-full flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-gray-600 text-lg">
                  {searchQuery ? "No courses found matching your search" : "No courses available yet"}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-blue-600 hover:text-blue-700 mt-2 text-sm font-medium"
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <Card key={course.id} className="bg-white border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-gray-900">{course.title}</CardTitle>
                  <CardDescription className="text-gray-600">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2 text-sm">
                      {course.trainer && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Instructor:</span>
                          <span className="text-gray-900 font-medium">
                            {course.trainer.firstName} {course.trainer.lastName}
                          </span>
                        </div>
                      )}
                      
                    </div>
                    <Link href={`/student/courses/${course.id}`} className="block">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700">
                        View Details →
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
