"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Certificate {
  id: number;
  userId: number;
  courseId: number;
  courseName: string;
  certificateNumber: string;
  issuedAt: string;
  expiresAt?: string;
}

export default function CertificateDetailPage() {
  const params = useParams();
  const certificateId = params.id as string;
  const { error } = useToast();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/certificates/${certificateId}`,
          {
            headers: {
              Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch certificate");
        }

        const data = await response.json();
        setCertificate(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch certificate";
        error(errorMessage);
        console.error("Error fetching certificate:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (certificateId) {
      fetchCertificate();
    }
  }, [certificateId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-gray-600">Loading certificate...</p>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="bg-white border-gray-200 max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-4xl mb-4">❌</p>
            <p className="text-gray-900 font-semibold text-lg">Certificate Not Found</p>
            <p className="text-gray-600 mt-2">The certificate you're looking for doesn't exist.</p>
            <Link href="/student/certificates">
              <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                Back to Certificates
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Certificate Display */}
        <Card className="shadow-2xl border-0 overflow-hidden">
          <CardContent className="p-0">
            {/* Decorative Header */}
            <div className="h-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>

            {/* Certificate Content */}
            <div className="p-12 text-center space-y-8">
              {/* Header */}
              <div>
                <p className="text-sm text-gray-600 uppercase tracking-widest font-semibold">Certificate of Completion</p>
                <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mt-4">🏆</h1>
              </div>

              {/* Course Name */}
              <div className="space-y-3">
                <p className="text-gray-700 text-lg font-medium">This is to certify that</p>
                <p className="text-4xl font-bold text-gray-900">{certificate.courseName || "Course Completed"}</p>
                <p className="text-gray-700 text-lg font-medium">has been successfully completed</p>
              </div>

              {/* Certificate Details */}
              <div className="border-t-2 border-b-2 border-gradient-to-r from-blue-200 to-purple-200 py-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Certificate Number</p>
                    <p className="text-2xl font-mono font-bold text-blue-600 mt-2">{certificate.certificateNumber}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Issued On</p>
                    <p className="text-2xl font-bold text-purple-600 mt-2">
                      {new Date(certificate.issuedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                {certificate.expiresAt && (
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Expires On</p>
                    <p className="text-2xl font-bold text-orange-600 mt-2">
                      {new Date(certificate.expiresAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="text-gray-700 space-y-2">
                <p className="font-medium">This certificate is awarded in recognition of</p>
                <p>successful completion of the course and demonstrates proficiency in the subject matter.</p>
              </div>

              {/* Signature Line */}
              <div className="pt-4 border-t border-gray-300">
                <p className="text-gray-600 text-sm">Authorized by E-Learning Platform</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
            📥 Download Certificate
          </Button>
          <Button variant="outline" className="border-gray-300 text-gray-900 hover:bg-gray-50 px-6 py-2">
            🔗 Share Certificate
          </Button>
          <Button variant="outline" className="border-gray-300 text-gray-900 hover:bg-gray-50 px-6 py-2">
            🖨️ Print Certificate
          </Button>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link href="/student/certificates" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span className="ml-2">Back to Certificates</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
