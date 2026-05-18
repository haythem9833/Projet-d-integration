"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { certificateAPI } from "@/lib/api";
import { Certificate } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const data = await certificateAPI.getAll() as Certificate[];
        setCertificates(data);
      } catch (err) {
        console.error("Failed to fetch certificates:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">My Certificates</h1>
          <p className="text-gray-600 mt-2">View and manage your earned certificates</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">🏆</p>
                <p className="text-2xl font-bold text-blue-900 mt-2">{certificates.length}</p>
                <p className="text-blue-700 mt-1 font-medium">Certificates Earned</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">✅</p>
                <p className="text-2xl font-bold text-green-900 mt-2">{certificates.length}</p>
                <p className="text-blue-700 mt-1 font-medium">Courses Completed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-purple-600">📜</p>
                <p className="text-2xl font-bold text-purple-900 mt-2">{certificates.length > 0 ? "Active" : "None"}</p>
                <p className="text-purple-700 mt-1 font-medium">Status</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certificates Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Certificates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full">
                <Card className="bg-white border-gray-200">
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-600">Loading certificates...</p>
                  </CardContent>
                </Card>
              </div>
            ) : certificates.length === 0 ? (
              <div className="col-span-full">
                <Card className="bg-white border-gray-200">
                  <CardContent className="p-12 text-center">
                    <p className="text-4xl mb-4">📚</p>
                    <p className="text-gray-900 font-semibold text-lg">No Certificates Yet</p>
                    <p className="text-gray-600 mt-2">Complete courses to earn certificates!</p>
                    <Link href="/student/courses">
                      <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                        Browse Courses
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            ) : (
              certificates.map((cert) => (
                <Card key={cert.id} className="bg-white border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-gray-900 line-clamp-2">Certificate of Completion</CardTitle>
                    <CardDescription className="text-gray-600">
                      Certificate #{cert.certificateNumber}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Issued:</span>
                        <span className="font-semibold text-gray-900">
                          {new Date(cert.issuedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Course ID:</span>
                        <span className="font-semibold text-gray-900">{cert.courseId}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Link href={`/student/certificates/${cert.id}`} className="flex-1">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          👁️ View
                        </Button>
                      </Link>
                      <Button variant="outline" className="flex-1 border-gray-200 text-gray-900 hover:bg-gray-50">
                        📥 Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
