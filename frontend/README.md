# E-Learning Platform Frontend

A modern, responsive frontend for an e-learning platform built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- **Authentication**: Login and registration for students and professors
- **Student Dashboard**: View enrolled courses, progress, and certificates
- **Professor Dashboard**: Create and manage courses
- **Admin Dashboard**: Platform statistics and management
- **Course Management**: Browse, view, and enroll in courses
- **Quiz System**: Take quizzes and track results
- **Certificates**: View earned certificates
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form + Zod
- **State Management**: Zustand
- **HTTP Client**: Fetch API
- **Notifications**: Sonner

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── admin/             # Admin pages
│   │   ├── professor/         # Professor pages
│   │   ├── student/           # Student pages
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   └── ui/               # Reusable UI components
│   ├── hooks/                # Custom React hooks
│   ├── lib/
│   │   ├── api.ts            # API client functions
│   │   ├── types.ts          # TypeScript types
│   │   └── utils.ts          # Utility functions
│   └── store/                # Zustand stores
├── public/                    # Static assets
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind config
├── next.config.ts            # Next.js config
└── README.md                 # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Installation

1. Clone the repository:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Create a `.env.local` file:
```bash
cp .env.example .env.local
```

4. Update the API URL in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Development

Start the development server:
```bash
npm run dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:
```bash
npm run build
npm start
```

## Pages Overview

### Public Pages
- `/login` - User login
- `/register` - User registration

### Student Pages
- `/student/dashboard` - Student dashboard with enrolled courses
- `/student/courses` - Browse all available courses
- `/student/courses/[id]` - Course details and modules
- `/student/quiz/[id]` - Take a quiz
- `/student/certificates` - View earned certificates

### Professor Pages
- `/professor/dashboard` - Professor dashboard with created courses
- `/professor/courses/create` - Create a new course
- `/professor/courses/[id]/edit` - Edit course details

### Admin Pages
- `/admin/dashboard` - Admin dashboard with platform statistics

## API Integration

The frontend communicates with the backend API at `http://localhost:8080/api`. Key endpoints:

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /courses` - Get all courses
- `GET /courses/:id` - Get course details
- `POST /courses` - Create course (professor)
- `PUT /courses/:id` - Update course (professor)
- `DELETE /courses/:id` - Delete course (professor)
- `GET /quizzes/:id` - Get quiz details
- `POST /quizzes/:id/submit` - Submit quiz answers
- `GET /certificates` - Get user certificates
- `GET /enrollments` - Get user enrollments

## Authentication

The app uses JWT token-based authentication. Tokens are stored in localStorage and sent with each API request via the `Authorization` header.

## Styling

The project uses Tailwind CSS with a custom color scheme. Colors are defined in `src/app/globals.css` and can be customized in `tailwind.config.ts`.

## Components

Reusable UI components are located in `src/components/ui/`:
- Button
- Card
- Input
- Label
- And more...

## State Management

User authentication state is managed with Zustand in `src/store/auth.ts`.

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is part of the E-Learning Platform.
