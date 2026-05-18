"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";

const sidebarItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
    { label: "All Courses", href: "/admin/courses", icon: "📚" },

  { label: "Users", href: "/admin/users", icon: "👥" },
  { label: "Reports", href: "/admin/reports", icon: "📈" },
  { label: "Settings", href: "/admin/settings", icon: "⚙️" },
];

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState("overview");

  const reports = [
    {
      id: 1,
      title: "Platform Overview",
      description: "General statistics about the platform",
      icon: "📊",
      metrics: [
        { label: "Total Users", value: "1,234" },
        { label: "Active Courses", value: "45" },
        { label: "Total Enrollments", value: "5,678" },
        { label: "Revenue", value: "$45,678" },
      ],
    },
    {
      id: 2,
      title: "User Activity",
      description: "User engagement and activity metrics",
      icon: "👥",
      metrics: [
        { label: "Active Users (Today)", value: "234" },
        { label: "New Users (This Week)", value: "56" },
        { label: "Avg. Session Duration", value: "23 min" },
        { label: "Bounce Rate", value: "12%" },
      ],
    },
    {
      id: 3,
      title: "Course Performance",
      description: "Course enrollment and completion rates",
      icon: "📚",
      metrics: [
        { label: "Avg. Completion Rate", value: "78%" },
        { label: "Most Popular Course", value: "React Basics" },
        { label: "Avg. Rating", value: "4.5/5" },
        { label: "Total Lessons", value: "234" },
      ],
    },
    {
      id: 4,
      title: "Revenue Report",
      description: "Financial metrics and revenue tracking",
      icon: "💰",
      metrics: [
        { label: "Total Revenue", value: "$45,678" },
        { label: "Avg. Course Price", value: "$99" },
        { label: "Revenue Growth", value: "+15%" },
        { label: "Pending Payments", value: "$5,234" },
      ],
    },
  ];

  const selectedReport = reports.find((r) => r.id.toString() === reportType) || reports[0];

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">View detailed reports and analytics about your platform</p>
        </div>

        {/* Report Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reports.map((report) => (
            <Card
              key={report.id}
              className={`cursor-pointer transition-all ${
                reportType === report.id.toString()
                  ? "ring-2 ring-blue-500 shadow-lg"
                  : "hover:shadow-md"
              }`}
              onClick={() => setReportType(report.id.toString())}
            >
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl mb-2">{report.icon}</p>
                  <p className="font-semibold text-sm">{report.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Report */}
        <Card>
          <CardHeader>
            <CardTitle>{selectedReport.title}</CardTitle>
            <CardDescription>{selectedReport.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {selectedReport.metrics.map((metric, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <p className="text-gray-600 text-sm">{metric.label}</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">{metric.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly user growth trend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-600">📊 Chart visualization would go here</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue trend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-600">📈 Chart visualization would go here</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle>Export Report</CardTitle>
            <CardDescription>Download reports in various formats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <Button variant="outline">📄 Export as PDF</Button>
              <Button variant="outline">📊 Export as Excel</Button>
              <Button variant="outline">📋 Export as CSV</Button>
              <Button variant="outline">📧 Email Report</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
