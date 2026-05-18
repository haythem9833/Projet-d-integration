# Backend API Endpoints - E-Learning Platform

## Base URL
```
http://localhost:8081/api
```

## Authentication Endpoints

### Login
```
POST /auth/login
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

### 2. Signup (Register)
```
POST /auth/signup
Content-Type: application/json

Request:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com"
}
```

### 3. Logout
```
POST /auth/logout

Response:
"Logout successful"
```

---

## User Endpoints

### 1. Get All Users
```
GET /auth/users

Response:
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  },
  ...
]
```

---

## Course Endpoints

### 1. Get All Courses
```
GET /courses

Response:
[
  {
    "id": 1,
    "title": "React Basics",
    "description": "Learn React",
    "professor": { ... },
    "modules": [ ... ],
    "enrollments": [ ... ]
  },
  ...
]
```

### 2. Get Course by ID
```
GET /courses/{id}

Response:
{
  "id": 1,
  "title": "React Basics",
  "description": "Learn React",
  "professor": { ... },
  "modules": [ ... ],
  "enrollments": [ ... ]
}
```

### 3. Create Course (TRAINER/ADMIN only)
```
POST /courses
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "title": "React Basics",
  "description": "Learn React fundamentals"
}

Response:
{
  "id": 1,
  "title": "React Basics",
  "description": "Learn React fundamentals",
  ...
}
```

---

## Module Endpoints

### 1. Create Module
```
POST /modules
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "title": "Module 1",
  "description": "Introduction",
  "courseId": 1,
  "order": 1
}

Response:
{
  "id": 1,
  "title": "Module 1",
  ...
}
```

### 2. Get Modules by Course
```
GET /modules/course/{courseId}

Response:
[
  {
    "id": 1,
    "title": "Module 1",
    "description": "Introduction",
    "courseId": 1,
    "lessons": [ ... ]
  },
  ...
]
```

---

## Lesson Endpoints

### 1. Create Lesson
```
POST /lessons
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "title": "Lesson 1",
  "content": "Lesson content here",
  "moduleId": 1,
  "order": 1
}

Response:
{
  "id": 1,
  "title": "Lesson 1",
  "content": "Lesson content here",
  ...
}
```

### 2. Get Lessons by Module
```
GET /lessons/module/{moduleId}

Response:
[
  {
    "id": 1,
    "title": "Lesson 1",
    "content": "Lesson content here",
    "moduleId": 1
  },
  ...
]
```

---

## Quiz Endpoints

### 1. Create Quiz
```
POST /quizzes
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "title": "Quiz 1",
  "description": "Test your knowledge",
  "courseId": 1,
  "passingScore": 70
}

Response:
{
  "id": 1,
  "title": "Quiz 1",
  ...
}
```

### 2. Get Quizzes by Course
```
GET /quizzes/course/{courseId}

Response:
[
  {
    "id": 1,
    "title": "Quiz 1",
    "description": "Test your knowledge",
    "courseId": 1,
    "questions": [ ... ]
  },
  ...
]
```

### 3. Submit Quiz
```
POST /quizzes/{quizId}/submit
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "1": 2,
  "2": 3,
  "3": 1
}

Response:
{
  "score": 85,
  "passed": true,
  "message": "Quiz submitted successfully"
}
```

---

## Enrollment Endpoints

### 1. Get Student Enrollments
```
GET /enrollments/student/{studentId}
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "userId": 1,
    "courseId": 1,
    "enrolledAt": "2026-05-03T10:00:00Z",
    "completedAt": null,
    "progress": 45
  },
  ...
]
```

### 2. Update Enrollment Progress
```
PUT /enrollments/{enrollmentId}/progress/{value}
Authorization: Bearer {token}

Response:
{
  "id": 1,
  "userId": 1,
  "courseId": 1,
  "progress": 50
}
```

---

## Certificate Endpoints

### 1. Generate Certificate
```
POST /certificates/generate/{userId}/{courseId}
Authorization: Bearer {token}

Response:
{
  "id": 1,
  "userId": 1,
  "courseId": 1,
  "issuedAt": "2026-05-03T10:00:00Z",
  "certificateNumber": "CERT-2026-001"
}
```

---

## Payment Endpoints

### 1. Create Payment
```
POST /payments
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "userId": 1,
  "courseId": 1,
  "amount": 99.99
}

Response:
{
  "id": 1,
  "userId": 1,
  "courseId": 1,
  "amount": 99.99,
  "status": "PENDING"
}
```

### 2. Get User Payments
```
GET /payments/user/{userId}
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "userId": 1,
    "courseId": 1,
    "amount": 99.99,
    "status": "COMPLETED",
    "createdAt": "2026-05-03T10:00:00Z"
  },
  ...
]
```

---

## Admin Endpoints

### 1. Get Dashboard
```
GET /admin/dashboard
Authorization: Bearer {token}
Roles: ADMIN

Response:
{
  "totalUsers": 100,
  "totalCourses": 10,
  "totalEnrollments": 500,
  "totalRevenue": 50000
}
```

### 2. Delete User
```
DELETE /admin/users/{userId}
Authorization: Bearer {token}
Roles: ADMIN

Response:
"User deleted successfully"
```

### 3. Block User
```
PUT /admin/users/{userId}/block
Authorization: Bearer {token}
Roles: ADMIN

Response:
{
  "id": 1,
  "email": "user@example.com",
  "blocked": true
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request",
  "message": "Email is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Authentication

Most endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer {token}
```

The token is obtained from the `/auth/login` endpoint.

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Signup
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get All Courses
```bash
curl -X GET http://localhost:8080/api/courses
```

### Create Course (with token)
```bash
curl -X POST http://localhost:8080/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "title": "React Basics",
    "description": "Learn React"
  }'
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Pagination is not implemented yet
- Role-based access control is enforced on certain endpoints
- Valid roles: ADMIN, TRAINER, STUDENT
