# E-Learning Platform - Implementation Guide

## Overview
This is a Netflix-style e-learning platform where professors create and manage video courses, and students can enroll and watch lessons.

## Architecture

### Role-Based Access
The platform has 4 user roles with different dashboards:

1. **STUDENT** - `/student/dashboard`
   - Browse and enroll in courses
   - Watch video lessons
   - Track progress
   - View certificates

2. **PROFESSOR** - `/professor/dashboard`
   - Create and manage courses
   - Add modules to courses
   - Add video lessons to modules
   - View student enrollments

3. **TRAINER** - `/professor/dashboard` (same as professor)
   - Same permissions as professor

4. **ADMIN** - `/admin/dashboard`
   - View all courses
   - Manage users
   - View reports and statistics

## Key Features

### 1. Role-Based Routing
When users log in, they are automatically redirected to their appropriate dashboard:
- ADMIN → `/admin/dashboard`
- PROFESSOR/TRAINER → `/professor/dashboard`
- STUDENT → `/student/dashboard`

### 2. Navigation Components

#### Navbar
- Located at the top of every page
- Shows user name and role
- Logout button
- Responsive design

#### Sidebar
- Available on dashboard pages
- Quick navigation to main sections
- Active page highlighting
- Role-specific menu items

### 3. Professor Video Management Workflow

#### Step 1: Create a Course
1. Go to Professor Dashboard
2. Click "Create Course" button
3. Fill in course details (title, description, category, level, price)
4. Submit to create the course

#### Step 2: Add Modules
1. From Professor Dashboard, click "Manage Modules" on a course
2. Fill in module title and description
3. Click "Create Module"
4. Modules appear in the list

#### Step 3: Add Video Lessons
1. Click "Add Lesson with Video" on a module
2. Fill in:
   - **Lesson Title**: Name of the lesson
   - **Video URL**: URL to the video (see supported formats below)
   - **Lesson Description**: What students will learn
3. Click "Create Lesson"

#### Supported Video Formats
- **YouTube**: `https://youtube.com/embed/VIDEO_ID`
- **Vimeo**: `https://vimeo.com/VIDEO_ID`
- **Direct MP4**: `https://example.com/video.mp4`
- **Test Video**: `https://www.w3schools.com/html/mov_bbb.mp4`

### 4. Student Learning Workflow

#### Step 1: Browse Courses
1. Go to Student Dashboard
2. Click "Browse Courses"
3. View all available courses with professor info and module count

#### Step 2: View Course Details
1. Click on a course
2. See all modules and lessons
3. Click on a lesson to start watching

#### Step 3: Watch Lessons
1. Video player with controls:
   - Play/Pause button
   - Progress bar (clickable to seek)
   - Time display
   - Progress indicator
2. Progress is tracked automatically

## API Endpoints

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/{id}` - Get course details
- `POST /api/courses` - Create course (PROFESSOR/ADMIN only)
- `PUT /api/courses/{id}` - Update course (PROFESSOR/ADMIN only)
- `DELETE /api/courses/{id}` - Delete course (ADMIN only)

### Modules
- `GET /api/modules/course/{courseId}` - Get modules for a course
- `POST /api/modules` - Create module (PROFESSOR/ADMIN only)

### Lessons
- `GET /api/lessons/module/{moduleId}` - Get lessons for a module
- `POST /api/lessons` - Create lesson (PROFESSOR/ADMIN only)

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

## Database Schema

### User
- id (Long)
- email (String)
- firstName (String)
- lastName (String)
- password (String)
- role (Enum: ADMIN, PROFESSOR, TRAINER, STUDENT)
- createdAt (DateTime)

### Course
- id (Long)
- title (String)
- description (String)
- price (Double)
- category (String)
- level (String)
- professor (User)
- modules (List<Module>)
- enrollments (List<Enrollment>)

### Module
- id (Long)
- title (String)
- description (String)
- course (Course)
- lessons (List<Lesson>)

### Lesson
- id (Long)
- title (String)
- content (String)
- videoUrl (String)
- module (Module)

## Frontend Structure

```
frontend/src/
├── app/
│   ├── page.tsx (Home - redirects based on role)
│   ├── login/
│   ├── register/
│   ├── admin/
│   │   └── dashboard/
│   ├── professor/
│   │   ├── dashboard/
│   │   └── courses/
│   │       ├── create/
│   │       ├── [id]/
│   │       │   ├── edit/
│   │       │   └── modules/
│   │       │       └── [moduleId]/
│   │       │           └── lessons/
│   └── student/
│       ├── dashboard/
│       ├── courses/
│       │   └── [id]/
│       ├── lesson/
│       │   └── [id]/
│       ├── quiz/
│       │   └── [id]/
│       └── certificates/
├── components/
│   ├── Navbar.tsx (Top navigation)
│   ├── Sidebar.tsx (Side navigation)
│   ├── DashboardLayout.tsx (Layout wrapper)
│   ├── VideoPlayer.tsx (Video player component)
│   ├── LandingPage.tsx (Landing page)
│   └── ui/ (shadcn/ui components)
├── lib/
│   ├── api.ts (API client)
│   ├── types.ts (TypeScript types)
│   └── utils.ts (Utility functions)
└── store/
    └── auth.ts (Zustand auth store)
```

## Styling

- **Framework**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Color Scheme**:
  - Primary: Blue (#2563eb)
  - Secondary: Indigo (#4f46e5)
  - Accent: Green, Purple, Orange for stats

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8081/api
```

## Running the Application

### Backend
```bash
cd backend
mvn spring-boot:run
```
Backend runs on `http://localhost:8081`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`

## Testing the Application

### Test User Accounts

#### Admin
- Email: `admin@example.com`
- Password: `password123`
- Role: ADMIN

#### Professor
- Email: `professor@example.com`
- Password: `password123`
- Role: PROFESSOR

#### Student
- Email: `student@example.com`
- Password: `password123`
- Role: STUDENT

### Test Workflow

1. **Register a new professor account**
   - Go to `/register`
   - Select "Professor" role
   - Create account

2. **Create a course**
   - Login as professor
   - Click "Create Course"
   - Fill in details

3. **Add modules**
   - Click "Manage Modules"
   - Create a module

4. **Add video lessons**
   - Click "Add Lesson with Video"
   - Use test video URL: `https://www.w3schools.com/html/mov_bbb.mp4`
   - Create lesson

5. **View as student**
   - Login as student
   - Go to "Browse Courses"
   - Click on the course
   - Click on a lesson to watch

## Troubleshooting

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Rebuild: `npm run build`

### API Connection Issues
- Verify backend is running on port 8081
- Check `.env` file has correct API URL
- Check CORS is enabled in backend

### Video Not Playing
- Verify video URL is accessible
- Try test video URL first
- Check browser console for errors

## Future Enhancements

1. **Progress Tracking**
   - Save lesson progress to database
   - Resume from last watched position

2. **Quizzes**
   - Add quiz functionality
   - Track quiz scores

3. **Certificates**
   - Generate certificates on course completion
   - Download certificates

4. **Comments & Discussion**
   - Add comments to lessons
   - Discussion forums

5. **Search & Filtering**
   - Search courses by title
   - Filter by category, level, price

6. **Notifications**
   - Email notifications
   - In-app notifications

7. **Analytics**
   - Course completion rates
   - Student engagement metrics
   - Revenue reports
