const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082/api";

export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `API Error: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      // Si la réponse n'est pas du JSON, utiliser le message par défaut
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Auth endpoints
export const authAPI = {
  login: (email: string, password: string) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }) =>
    apiCall("/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
      }),
    }),
};

// Course endpoints
export const courseAPI = {
  getAll: () => apiCall("/courses"),
  getById: (id: number) => apiCall(`/courses/${id}`),
  create: (data: any) =>
    apiCall("/courses", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiCall(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiCall(`/courses/${id}`, {
      method: "DELETE",
    }),
};

// Enrollment endpoints
export const enrollmentAPI = {
  getMyCourses: () => apiCall("/enrollments/my-courses"),
  enroll: (courseId: number) =>
    apiCall(`/enrollments/enroll/${courseId}`, {
      method: "POST",
    }),
  checkEnrollment: (courseId: number) => apiCall<boolean>(`/enrollments/check/${courseId}`),
  getByStudent: (studentId: number) => apiCall(`/enrollments/student/${studentId}`),
  updateProgress: (enrollmentId: number, progress: number) =>
    apiCall(`/enrollments/${enrollmentId}/progress/${progress}`, {
      method: "PUT",
    }),
};

// Question endpoints
export const questionAPI = {
  create: (data: {
    questionText: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: string;
    quizId: number;
  }) =>
    apiCall("/questions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getByQuiz: (quizId: number) =>
    apiCall(`/questions/quiz/${quizId}`),
  getById: (id: number) =>
    apiCall(`/questions/${id}`),
  delete: (id: number) =>
    apiCall(`/questions/${id}`, {
      method: "DELETE",
    }),
};

// Quiz endpoints
export const quizAPI = {
  getAll: () => apiCall("/quiz"),
  getById: (id: number) => apiCall(`/quiz/${id}`),
  create: (data: {
    title: string;
    description: string;
    passingScore: number;
    moduleId: number;
    courseId: number;
  }) =>
    apiCall("/quiz", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  submit: (quizId: number, answers: any) =>
    apiCall(`/quiz/${quizId}/submit`, {
      method: "POST",
      body: JSON.stringify(answers),
    }),
};

// Certificate endpoints
export const certificateAPI = {
  getAll: () => apiCall("/certificates"),
  getById: (id: number) => apiCall(`/certificates/${id}`),
};

// User endpoints
export const userAPI = {
  getProfile: () => apiCall("/users/profile"),
  updateProfile: (data: any) =>
    apiCall("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  getAllUsers: () => apiCall("/auth/users"),
};

// Module endpoints
export const moduleAPI = {
  create: (data: { title: string; description: string; courseId: number }) =>
    apiCall("/modules", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getByCourse: (courseId: number) =>
    apiCall(`/modules/course/${courseId}`),
  getById: (id: number) =>
    apiCall(`/modules/${id}`),
  delete: (id: number) =>
    apiCall(`/modules/${id}`, {
      method: "DELETE",
    }),
};

// Lesson endpoints
export const lessonAPI = {
  create: (data: {
    title: string;
    content: string;
    videoUrl: string;
    moduleId: number;
  }) =>
    apiCall("/lessons", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getByModule: (moduleId: number) =>
    apiCall(`/lessons/module/${moduleId}`),
  getById: (id: number) =>
    apiCall(`/lessons/${id}`),
};

// Payment endpoints
export const paymentAPI = {
  getPlans: () => apiCall("/payments/plans"),
  processPayment: (data: {
    planId: number;
    cardNumber: string;
    cardholderName: string;
    expiryDate: string;
    cvv: string;
  }) =>
    apiCall("/payments/process", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getActiveSubscription: () => apiCall("/payments/subscriptions/active"),
  createSubscription: (planId: number) =>
    apiCall("/payments/subscriptions/create", {
      method: "POST",
      body: JSON.stringify({ planId }),
    }),
};
