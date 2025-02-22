<!-- THIS IS A SUMMARY OF A PROJECT, CURSOR UPDATES IT EACH SESSION ** DO NOT DELETE THIS FILE ** -->

# AlternativeOSS Project Summary

## Project Overview
AlternativeOSS is a Next.js application built with modern web technologies, focusing on performance, type safety, and best practices.

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Package Manager**: pnpm
- **UI Components**: Shadcn UI + Radix UI
- **Styling**: Tailwind CSS
- **Database ORM**: Drizzle
- **Form Validation**: Zod
- **Server Actions**: zsa-react
- **URL State Management**: nuqs

## Project Structure

```
src/
├── app/           # Next.js App Router pages and layouts
├── components/    # Reusable UI components
├── config/        # Application configuration
├── db/           # Database schema and migrations
├── lib/          # Utility functions and shared logic
└── services/     # External service integrations
```

## Key Features and Conventions
1. **Architecture**
   - Server-first approach with React Server Components (RSC)
   - Minimal client-side JavaScript
   - Type-safe database operations with Drizzle ORM

2. **Code Style**
   - Functional programming patterns
   - TypeScript throughout
   - Named exports for components
   - Modular and DRY code structure

3. **Performance Optimizations**
   - Server Components by default
   - Dynamic imports for client components
   - Suspense boundaries for loading states
   - Image optimization with Next.js

4. **Development Guidelines**
   - Mobile-first responsive design
   - Strict TypeScript usage
   - Component-driven development
   - Consistent file naming (kebab-case)

## Configuration Files
- `.cursorrules`: Project conventions and rules
- `next.config.ts`: Next.js configuration
- `drizzle.config.ts`: Database configuration
- `components.json`: Shadcn UI setup
- `tsconfig.json`: TypeScript configuration
- `eslint.config.mjs`: ESLint rules

## Environment Setup
- Development environment variables in `.env`
- Git ignore patterns in `.gitignore`
- PostCSS configuration for Tailwind

## Best Practices
1. **Component Structure**
   - Exported component first
   - Subcomponents next
   - Helper functions
   - Static content
   - TypeScript types/interfaces

2. **State Management**
   - URL state with nuqs
   - Server state with RSC
   - Minimal client state

3. **Performance**
   - Optimized Web Vitals
   - Lazy loading
   - Image optimization
   - Efficient bundling

4. **Type Safety**
   - Strict TypeScript usage
   - Zod schema validation
   - Type-safe API routes
   - ORM type safety

This project follows modern web development best practices, emphasizing type safety, performance, and maintainable code structure.
