export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "PROFESSOR" | "TRAINER" | "STUDENT";
  createdAt: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  trainer: User;
  modules: Module[];
  enrollments: Enrollment[];
  createdAt: string;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  courseId: number;
  lessons: Lesson[];
  quiz?: Quiz;
  order: number;
}

export interface Lesson {
  id: number;
  title: string;
  content: string;
  videoUrl?: string;
  moduleId: number;
  order: number;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  moduleId?: number;
  courseId?: number;
  questions: Question[];
  passingScore: number;
}

export interface Question {
  id: number;
  text: string;
  quizId: number;
  answers: Answer[];
  correctAnswerId: number;
}

export interface Answer {
  id: number;
  text: string;
  questionId: number;
  isCorrect: boolean;
}

export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  enrolledAt: string;
  completedAt?: string;
  progress: number;
}

export interface Certificate {
  id: number;
  userId: number;
  courseId: number;
  issuedAt: string;
  certificateNumber: string;
}

export interface Payment {
  id: number;
  userId: number;
  courseId: number;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
}
