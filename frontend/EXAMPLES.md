# Frontend E-Learning Platform - Exemples d'Utilisation

## 🎯 Exemples Pratiques

### 1. Utiliser le Client API

```typescript
// src/lib/api.ts - Exemples d'utilisation

// Connexion
const response = await authAPI.login('user@example.com', 'password123');
// Retourne: { token: 'jwt_token', user: { id, email, role, ... } }

// Inscription
const newUser = await authAPI.register({
  email: 'student@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  role: 'STUDENT'
});

// Récupérer tous les cours
const courses = await courseAPI.getAll();

// Récupérer un cours spécifique
const course = await courseAPI.getById(1);

// Créer un cours (professeur)
const newCourse = await courseAPI.create({
  title: 'Introduction to React',
  description: 'Learn React basics'
});

// Soumettre un quiz
const result = await quizAPI.submit(1, {
  1: 2,  // Question 1, Answer 2
  2: 3,  // Question 2, Answer 3
  3: 1   // Question 3, Answer 1
});
```

### 2. Utiliser le Store d'Authentification

```typescript
// src/store/auth.ts - Exemples d'utilisation

import { useAuthStore } from '@/store/auth';

function MyComponent() {
  const { user, token, setUser, setToken, logout, isAuthenticated } = useAuthStore();

  // Vérifier si l'utilisateur est connecté
  if (!isAuthenticated()) {
    return <div>Veuillez vous connecter</div>;
  }

  // Afficher le nom de l'utilisateur
  return (
    <div>
      <p>Bienvenue, {user?.firstName}!</p>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
}
```

### 3. Créer une Page avec Formulaire

```typescript
// src/app/professor/courses/create/page.tsx - Exemple complet

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { courseAPI } from '@/lib/api';

// Schéma de validation
const courseSchema = z.object({
  title: z.string().min(3, 'Le titre doit avoir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit avoir au moins 10 caractères'),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function CreateCoursePage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
  });

  const onSubmit = async (data: CourseFormData) => {
    setIsLoading(true);
    try {
      await courseAPI.create(data);
      success('Cours créé avec succès!');
      router.push('/professor/dashboard');
    } catch (err) {
      error('Erreur lors de la création du cours');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Créer un Nouveau Cours</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titre du Cours</Label>
                <Input
                  id="title"
                  placeholder="Entrez le titre du cours"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  placeholder="Entrez la description du cours"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2"
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Création...' : 'Créer le Cours'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### 4. Utiliser les Notifications Toast

```typescript
// Exemples d'utilisation du hook useToast

import { useToast } from '@/hooks/use-toast';

function MyComponent() {
  const { success, error, info, warning } = useToast();

  return (
    <div className="space-y-4">
      <button onClick={() => success('Opération réussie!')}>
        Succès
      </button>
      <button onClick={() => error('Une erreur est survenue!')}>
        Erreur
      </button>
      <button onClick={() => info('Information importante')}>
        Info
      </button>
      <button onClick={() => warning('Attention!')}>
        Avertissement
      </button>
    </div>
  );
}
```

### 5. Créer un Composant Réutilisable

```typescript
// src/components/CourseCard.tsx - Exemple de composant

import { Course } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: number) => void;
}

export function CourseCard({ course, onEnroll }: CourseCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>Instructeur: {course.professor.firstName} {course.professor.lastName}</p>
            <p>Modules: {course.modules.length}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/student/courses/${course.id}`} className="flex-1">
              <Button className="w-full">Voir les Détails</Button>
            </Link>
            {onEnroll && (
              <Button
                variant="outline"
                onClick={() => onEnroll(course.id)}
              >
                S'inscrire
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 6. Utiliser les Types TypeScript

```typescript
// Exemples d'utilisation des types

import { User, Course, Quiz, Certificate } from '@/lib/types';

// Créer un utilisateur
const user: User = {
  id: 1,
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'STUDENT',
  createdAt: new Date().toISOString(),
};

// Créer un cours
const course: Course = {
  id: 1,
  title: 'React Basics',
  description: 'Learn React',
  professor: user,
  modules: [],
  enrollments: [],
  createdAt: new Date().toISOString(),
};

// Créer un quiz
const quiz: Quiz = {
  id: 1,
  title: 'Quiz 1',
  description: 'Test your knowledge',
  courseId: 1,
  questions: [],
  passingScore: 70,
};

// Créer un certificat
const certificate: Certificate = {
  id: 1,
  userId: 1,
  courseId: 1,
  issuedAt: new Date().toISOString(),
  certificateNumber: 'CERT-2026-001',
};
```

### 7. Protéger une Route avec Authentification

```typescript
// src/app/student/dashboard/page.tsx - Exemple avec protection

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export default function StudentDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Rediriger si non authentifié
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Rediriger si le rôle n'est pas correct
    if (user?.role !== 'STUDENT') {
      router.push('/');
      return;
    }
  }, [user, isAuthenticated, router]);

  if (!isAuthenticated()) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1>Bienvenue, {user?.firstName}!</h1>
      {/* Contenu du dashboard */}
    </div>
  );
}
```

### 8. Utiliser React Query pour le Caching (Optionnel)

```typescript
// Exemple d'intégration avec React Query

import { useQuery } from '@tanstack/react-query';
import { courseAPI } from '@/lib/api';

function CoursesList() {
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseAPI.getAll(),
  });

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return (
    <div>
      {courses?.map((course) => (
        <div key={course.id}>{course.title}</div>
      ))}
    </div>
  );
}
```

### 9. Ajouter un Middleware d'Authentification

```typescript
// src/middleware.ts - Exemple de middleware

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Routes protégées
  const protectedRoutes = ['/admin', '/professor', '/student'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### 10. Utiliser les Variables d'Environnement

```typescript
// Exemples d'utilisation des variables d'environnement

// Dans les fichiers .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_NAME=E-Learning Platform

// Dans le code
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const appName = process.env.NEXT_PUBLIC_APP_NAME;

// Utilisation dans le client
console.log(`${appName} - API: ${apiUrl}`);
```

## 🎓 Bonnes Pratiques

### 1. Gestion des Erreurs
```typescript
try {
  const data = await courseAPI.getAll();
  // Traiter les données
} catch (error) {
  console.error('Erreur:', error);
  // Afficher un message d'erreur à l'utilisateur
}
```

### 2. Validation des Données
```typescript
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const validatedData = userSchema.parse(data);
```

### 3. Utiliser les Types
```typescript
// Toujours typer les props des composants
interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

function MyButton({ onClick, disabled, children }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
```

### 4. Optimiser les Performances
```typescript
// Utiliser useMemo pour les calculs coûteux
import { useMemo } from 'react';

const expensiveValue = useMemo(() => {
  return complexCalculation(data);
}, [data]);

// Utiliser useCallback pour les fonctions
import { useCallback } from 'react';

const handleClick = useCallback(() => {
  // Faire quelque chose
}, [dependencies]);
```

---

**Ces exemples montrent comment utiliser les différentes parties du frontend!**
