"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { quizAPI } from "@/lib/api";
import { Quiz } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/DashboardLayout";

const sidebarItems = [
  { label: "Dashboard", href: "/student/dashboard", icon: "📊" },
  { label: "Courses", href: "/student/courses", icon: "📚" },
  { label: "Progress", href: "/student/progress", icon: "📈" },
  { label: "Quizzes", href: "/student/quiz", icon: "❓" },
  { label: "Certificates", href: "/student/certificates", icon: "🏆" },
];

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;
  const { success, error } = useToast();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await quizAPI.getById(parseInt(quizId)) as Quiz;
        setQuiz(data);
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
        error("Failed to load quiz");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleAnswerChange = (questionId: number, answerId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await quizAPI.submit(parseInt(quizId), answers);
      success("Quiz submitted successfully!");
      router.push("/student/dashboard");
    } catch (err) {
      error("Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-400">Loading quiz...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!quiz) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-400">Quiz not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white">{quiz.title}</h1>
          <p className="text-gray-400 mt-2">{quiz.description}</p>
        </div>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">❓ Quiz Questions</CardTitle>
            <CardDescription>Answer all questions and submit when ready</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {quiz.questions.map((question, index) => (
                <div key={question.id} className="border-b border-gray-700 pb-6 last:border-b-0">
                  <h3 className="font-semibold text-white mb-4">
                    Question {index + 1}: {question.text}
                  </h3>
                  <div className="space-y-3">
                    {question.answers.map((answer) => (
                      <label key={answer.id} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700/50 transition">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={answer.id}
                          checked={answers[question.id] === answer.id}
                          onChange={() => handleAnswerChange(question.id, answer.id)}
                          className="w-4 h-4 accent-blue-500"
                        />
                        <span className="text-gray-300">{answer.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3"
              >
                {isSubmitting ? "Submitting..." : "✅ Submit Quiz"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
