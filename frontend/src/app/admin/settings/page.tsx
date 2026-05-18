"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/DashboardLayout";

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

export default function AdminSettingsPage() {
  const { success, error } = useToast();
  const [settings, setSettings] = useState({
    name: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Validate inputs
    if (!settings.name && !settings.newPassword) {
      error("Please fill in at least one field");
      return;
    }

    if (settings.newPassword && !settings.currentPassword) {
      error("Current password is required to change password");
      return;
    }

    if (settings.newPassword !== settings.confirmPassword) {
      error("New passwords do not match");
      return;
    }

    if (settings.newPassword && settings.newPassword.length < 6) {
      error("Password must be at least 6 characters");
      return;
    }

    success("Settings saved successfully!");
    setSettings({
      name: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Update your profile information</p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your name</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={settings.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Password Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Current Password</label>
              <input
                type="password"
                placeholder="Enter your current password"
                value={settings.currentPassword}
                onChange={(e) => handleChange("currentPassword", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">New Password</label>
              <input
                type="password"
                placeholder="Enter your new password"
                value={settings.newPassword}
                onChange={(e) => handleChange("newPassword", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm your new password"
                value={settings.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex gap-4">
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            💾 Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
