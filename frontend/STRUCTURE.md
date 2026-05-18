# Frontend Structure - E-Learning Platform

## Overview

Ce frontend a été créé en s'inspirant du style et de la structure du dossier `elearning-frontend`. Il utilise Next.js 16, TypeScript, Tailwind CSS et shadcn/ui pour créer une plateforme d'apprentissage moderne et responsive.

## Architecture

### Stack Technologique
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **Form Handling**: React Hook Form + Zod
- **State Management**: Zustand
- **HTTP Client**: Fetch API
- **Notifications**: Sonner

## Structure des Dossiers

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── admin/
│   │   │   └── dashboard/           # Admin dashboard
│   │   ├── professor/
│   │   │   ├── dashboard/           # Professor dashboard
│   │   │   └── courses/
│   │   │       ├── create/          # Create course
│   │   │       └── [id]/edit/       # Edit course
│   │   ├── student/
│   │   │   ├── dashboard/           # Student dashboard
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx         # Browse courses
│   │   │   │   └── [id]/            # Course details
│   │   │   ├── quiz/[id]/           # Take quiz
│   │   │   └── certificates/        # View certificates
│   │   ├── login/                   # Login page
│   │   ├── register/                # Registration page
│   │   ├── api/                     # API routes
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Home page (redirect)
│   │   └── globals.css              # Global styles
│   │
│   ├── components/
│   │   └── ui/                      # Reusable UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       └── textarea.tsx
│   │
│   ├── hooks/
│   │   └── use-toast.ts             # Toast notifications hook
│   │
│   ├── lib/
│   │   ├── api.ts                   # API client functions
│   │   ├── types.ts                 # TypeScript types
│   │   └── utils.ts                 # Utility functions
│   │
│   └── store/
│       └── auth.ts                  # Zustand auth store
│
├── public/                          # Static assets
├── .env                             # Environment variables
├── .env.example                     # Example env file
├── .gitignore                       # Git ignore rules
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── tailwind.config.ts               # Tailwind config
├── next.config.ts                   # Next.js config
├── postcss.config.mjs               # PostCSS config
├── eslint.config.mjs                # ESLint config
├── README.md                        # Project documentation
└── STRUCTURE.md                     # This file
```

## Pages Créées

### Public Pages
- **`/`** - Home (redirects based on user role)
- **`/login`** - User login with email/password
- **`/register`** - User registration (Student/Professor)

### Student Pages
- **`/student/dashboard`** - Main student dashboard with enrolled courses
- **`/student/courses`** - Browse all available courses
- **`/student/courses/[id]`** - View course details and modules
- **`/student/quiz/[id]`** - Take a quiz
- **`/student/certificates`** - View earned certificates

### Professor Pages
- **`/professor/dashboard`** - Professor dashboard with created courses
- **`/professor/courses/create`** - Create a new course
- **`/professor/courses/[id]/edit`** - Edit course details

### Admin Pages
- **`/admin/dashboard`** - Admin dashboard with platform statistics

## Components UI

### Reusable Components
- **Button** - Customizable button with variants (default, destructive, outline, secondary, ghost, link)
- **Card** - Container component with header, title, description, content, footer
- **Input** - Text input field
- **Label** - Form label
- **Textarea** - Multi-line text input

## API Integration

### API Client (`src/lib/api.ts`)

Fonctions groupées par domaine:

**Auth**
- `authAPI.login(email, password)`
- `authAPI.register(userData)`

**Courses**
- `courseAPI.getAll()`
- `courseAPI.getById(id)`
- `courseAPI.create(data)`
- `courseAPI.update(id, data)`
- `courseAPI.delete(id)`

**Enrollments**
- `enrollmentAPI.getAll()`
- `enrollmentAPI.getById(id)`
- `enrollmentAPI.create(courseId)`

**Quizzes**
- `quizAPI.getAll()`
- `quizAPI.getById(id)`
- `quizAPI.submit(quizId, answers)`

**Certificates**
- `certificateAPI.getAll()`
- `certificateAPI.getById(id)`

**Users**
- `userAPI.getProfile()`
- `userAPI.updateProfile(data)`

## State Management

### Auth Store (`src/store/auth.ts`)

Utilise Zustand pour gérer l'état d'authentification:
- `user` - Current user object
- `token` - JWT token
- `setUser()` - Set user
- `setToken()` - Set token (saved to localStorage)
- `logout()` - Clear auth state
- `isAuthenticated()` - Check if user is logged in

## Types (`src/lib/types.ts`)

Interfaces TypeScript pour:
- `User` - User profile
- `Course` - Course information
- `Module` - Course module
- `Lesson` - Module lesson
- `Quiz` - Quiz information
- `Question` - Quiz question
- `Answer` - Quiz answer
- `Enrollment` - Course enrollment
- `Certificate` - User certificate
- `Payment` - Payment information

## Styling

### Tailwind CSS
- Utilise Tailwind CSS v4 avec PostCSS
- Thème personnalisé avec variables CSS
- Support du mode sombre
- Animations personnalisées

### Colors
- Primary, Secondary, Destructive, Muted, Accent
- Foreground colors pour le contraste
- Border, Input, Ring colors

## Configuration

### Environment Variables
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_NAME=E-Learning Platform
```

### Build & Development
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
npm run type-check # Check TypeScript
```

## Features Implémentées

✅ Authentication (Login/Register)
✅ Role-based routing (Admin/Professor/Student)
✅ Course browsing and enrollment
✅ Quiz system
✅ Certificate management
✅ Responsive design
✅ Form validation with Zod
✅ Toast notifications
✅ API integration
✅ TypeScript support
✅ ESLint configuration

## Prochaines Étapes

- [ ] Ajouter plus de composants UI (Dialog, Tabs, etc.)
- [ ] Implémenter la pagination
- [ ] Ajouter des tests unitaires
- [ ] Implémenter la recherche et les filtres
- [ ] Ajouter des animations avec Framer Motion
- [ ] Implémenter le dark mode
- [ ] Ajouter des graphiques avec Recharts
- [ ] Implémenter la gestion des erreurs globale
- [ ] Ajouter des middlewares d'authentification
- [ ] Implémenter le cache avec React Query

## Notes

- Le frontend est conçu pour fonctionner avec le backend Spring Boot
- Les tokens JWT sont stockés dans localStorage
- Les requêtes API incluent automatiquement le token d'authentification
- Les erreurs API sont gérées avec des notifications toast
- Le design est responsive et mobile-friendly
