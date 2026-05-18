# Getting Started - E-Learning Platform Frontend

## Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun package manager
- Backend API running on `http://localhost:8080`

## Installation

### 1. Install Dependencies

```bash
cd frontend
npm install
# or
bun install
```

### 2. Configure Environment

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Update the API URL if needed:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_NAME=E-Learning Platform
```

### 3. Start Development Server

```bash
npm run dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Workflow

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Type check
npm run type-check
```

## Project Structure

```
src/
├── app/              # Next.js pages and layouts
├── components/       # Reusable React components
├── hooks/           # Custom React hooks
├── lib/             # Utilities and API client
└── store/           # Zustand state management
```

## Key Features

### Authentication
- Login with email/password
- Register as Student or Professor
- JWT token-based authentication
- Automatic token refresh

### Student Features
- Browse available courses
- View course details and modules
- Enroll in courses
- Take quizzes
- View certificates

### Professor Features
- Create and manage courses
- Edit course details
- View student enrollments
- Track course progress

### Admin Features
- View platform statistics
- Manage users and courses
- Monitor system health

## API Integration

The frontend communicates with the backend API. Make sure the backend is running:

```bash
# Backend should be running on port 8080
cd backend
./mvnw spring-boot:run
```

## Common Tasks

### Adding a New Page

1. Create a new file in `src/app/[role]/[page]/page.tsx`
2. Use the existing page structure as a template
3. Import necessary components and hooks
4. Add navigation links in the appropriate layout

### Adding a New Component

1. Create a new file in `src/components/ui/[component].tsx`
2. Export the component as default
3. Add TypeScript types
4. Use in pages as needed

### Adding API Endpoints

1. Add new functions to `src/lib/api.ts`
2. Follow the existing pattern with proper error handling
3. Use in components with `useEffect` or event handlers

### Styling

- Use Tailwind CSS classes
- Custom colors defined in `src/app/globals.css`
- Responsive design with `md:`, `lg:` breakpoints

## Troubleshooting

### Port 3000 Already in Use

```bash
# Kill the process using port 3000
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On macOS/Linux:
lsof -ti:3000 | xargs kill -9
```

### API Connection Issues

1. Check if backend is running on `http://localhost:8080`
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check browser console for CORS errors
4. Ensure backend has CORS enabled

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Try building again
npm run build
```

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

Create a `.env.production` file with production API URL:

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t elearning-frontend .
docker run -p 3000:3000 elearning-frontend
```

## Performance Tips

1. Use React DevTools to identify re-renders
2. Implement code splitting with dynamic imports
3. Optimize images with Next.js Image component
4. Use React Query for efficient data fetching
5. Implement pagination for large lists

## Security Best Practices

1. Never commit `.env.local` files
2. Use HTTPS in production
3. Validate all user inputs
4. Sanitize API responses
5. Implement CSRF protection
6. Use secure HTTP headers

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)
- [Zustand State Management](https://github.com/pmndrs/zustand)

## Support

For issues or questions:
1. Check the README.md
2. Review the STRUCTURE.md
3. Check browser console for errors
4. Verify backend API is running
5. Check network tab in DevTools

## Next Steps

1. Start the development server
2. Login with test credentials
3. Explore the different dashboards
4. Create a course (as professor)
5. Enroll in a course (as student)
6. Take a quiz
7. View certificates

Happy coding! 🚀
