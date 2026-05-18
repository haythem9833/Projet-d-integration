import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "E-Learning Platform",
  description: "A comprehensive e-learning platform for courses and certifications",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
