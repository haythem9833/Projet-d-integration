"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { questionAPI, moduleAPI } from "@/lib/api";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  ChartBarIcon,
  BookOpenIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const sidebarItems = [
  { label: "Dashboard", href: "/professor/dashboard", icon: <ChartBarIcon className="w-6 h-6" /> },
  { label: "My Courses", href: "/professor/courses", icon: <BookOpenIcon className="w-6 h-6" /> },
  { label: "Create Course", href: "/professor/courses/create", icon: <PlusIcon className="w-6 h-6" /> },
];

const questionSchema = z.object({
  questionText: z.string().min(5, "Question must be at least 5 characters"),
  optionA: z.string().min(2, "Option A must be at least 2 characters"),
  optionB: z.string().min(2, "Option B must be at least 2 characters"),
  optionC: z.string().min(2, "Option C must be at least 2 characters"),
  optionD: z.string().min(2, "Option D must be at least 2 characters"),
  correctAnswer: z.enum(["A", "B", "C", "D"], {
    errorMap: () => ({ message: "Please select a correct answer" }),
  }),
});

type QuestionFormData = z.infer<typeof questionSchema>;

export default function AddQuizQuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const moduleId = params.moduleId as string;
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [quizId, setQuizId] = useState<number | null>(null);
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [quizDescription, setQuizDescription] = useState<string>("");
  const [fetchError, setFetchError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
  });

  useEffect(() => {
    // Fetch module data to get quiz ID
    const fetchQuizData = async () => {
      try {
        setIsFetching(true);
        setFetchError(null);

        // Fetch module data
        const module = await moduleAPI.getById(parseInt(moduleId));

        // Check if module has a quiz
        if (!module.quiz) {
          setFetchError("No quiz found for this module");
          setIsFetching(false);
          return;
        }

        // Extract quiz ID and details
        const extractedQuizId = module.quiz.id;
        setQuizId(extractedQuizId);
        setQuizTitle(module.quiz.title || "Quiz");
        setQuizDescription(module.quiz.description || "");

        // Fetch existing questions for the quiz
        const existingQuestions = await questionAPI.getByQuiz(extractedQuizId);
        setQuestions(existingQuestions || []);

        setIsFetching(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load quiz data";
        console.error("Error fetching quiz:", err);
        setFetchError(errorMessage);
        setIsFetching(false);
      }
    };

    fetchQuizData();
  }, [moduleId]);

  const onSubmit = async (data: QuestionFormData) => {
    if (!quizId) {
      error("Quiz ID not found");
      return;
    }

    setIsLoading(true);
    try {
      const newQuestion = await questionAPI.create({
        questionText: data.questionText,
        optionA: data.optionA,
        optionB: data.optionB,
        optionC: data.optionC,
        optionD: data.optionD,
        correctAnswer: data.correctAnswer,
        quizId: quizId,
      });
      
      setQuestions([...questions, newQuestion]);
      success("Question added successfully!");
      reset();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add question";
      error(errorMessage);
      console.error("Error adding question:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (fetchError) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <div className="space-y-8">
          <div>
            <Link href={`/professor/courses/${courseId}/modules`} className="text-green-600 hover:text-green-700 text-sm font-medium mb-2 inline-block">
              ← Back to Modules
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mt-2">Quiz Error</h1>
          </div>
          <Card className="bg-red-50 border-2 border-red-300">
            <CardContent className="p-6">
              <p className="text-red-700 font-medium">❌ {fetchError}</p>
              <Button
                onClick={() => router.push(`/professor/courses/${courseId}/modules`)}
                className="mt-4 bg-red-600 hover:bg-red-700"
              >
                Back to Modules
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <Link href={`/professor/courses/${courseId}/modules`} className="text-green-600 hover:text-green-700 text-sm font-medium mb-2 inline-block">
            ← Back to Modules
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mt-2">Add Quiz Questions</h1>
          <p className="text-gray-600 mt-2">Add multiple choice questions to your quiz</p>
        </div>

        {/* Quiz Info Header */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900 text-2xl">{quizTitle}</CardTitle>
            <CardDescription className="text-blue-700 text-base">{quizDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-sm text-blue-700">
                <span className="font-semibold">Quiz ID:</span> {quizId}
              </div>
              <div className="text-sm text-blue-700">
                <span className="font-semibold">Questions:</span> {questions.length}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Question Form */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-gray-200 sticky top-24 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-200">
                <CardTitle className=\"text-gray-900 text-xl flex items-center gap-2\"><PlusIcon className=\"w-6 h-6\" /> Add Question</CardTitle>
                <CardDescription className="text-gray-600">Add a new question to the quiz</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Question Text */}
                  <div className="space-y-2">
                    <Label htmlFor="questionText" className="text-gray-700 font-semibold">Question</Label>
                    <textarea
                      id="questionText"
                      placeholder="Enter your question"
                      className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500"
                      {...register("questionText")}
                    />
                    {errors.questionText && (
                      <p className="text-sm text-red-600">{errors.questionText.message}</p>
                    )}
                  </div>

                  {/* Options */}
                  {["A", "B", "C", "D"].map((option) => (
                    <div key={option} className="space-y-2">
                      <Label htmlFor={`option${option}`} className="text-gray-700 font-semibold">
                        Option {option}
                      </Label>
                      <Input
                        id={`option${option}`}
                        placeholder={`Enter option ${option}`}
                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        {...register(`option${option}` as any)}
                      />
                      {errors[`option${option}` as any] && (
                        <p className="text-sm text-red-600">{errors[`option${option}` as any]?.message}</p>
                      )}
                    </div>
                  ))}

                  {/* Correct Answer */}
                  <div className="space-y-2">
                    <Label htmlFor="correctAnswer" className="text-gray-700 font-semibold">Correct Answer</Label>
                    <select
                      id="correctAnswer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:border-orange-500 focus:ring-orange-500"
                      {...register("correctAnswer")}
                    >
                      <option value="">Select correct answer</option>
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                    {errors.correctAnswer && (
                      <p className="text-sm text-red-600">{errors.correctAnswer.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold"
                  >
                    {isLoading ? "Adding..." : "✅ Add Question"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Questions List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {questions.length === 0 ? (
                <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300">
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-600 text-lg">📭 No questions yet. Add your first question!</p>
                  </CardContent>
                </Card>
              ) : (
                questions.map((question, index) => (
                  <Card key={question.id} className="bg-white border-2 border-gray-200 hover:border-orange-400 transition-all">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-orange-50 border-b-2 border-gray-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-gray-900">{question.questionText}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        {["A", "B", "C", "D"].map((option) => (
                          <div
                            key={option}
                            className={`p-3 rounded-lg border-2 ${
                              question.correctAnswer === option
                                ? "bg-green-50 border-green-300"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <p className="text-sm font-medium text-gray-900">
                              {option}. {question[`option${option}`]}
                              {question.correctAnswer === option && (
                                <span className="ml-2 text-green-600 font-bold">✓ Correct</span>
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        {questions.length > 0 && (
          <div className="flex gap-4">
            <Button
              onClick={() => router.push(`/professor/courses/${courseId}/modules`)}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              ✅ Save and Continue
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
