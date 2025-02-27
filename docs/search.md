# Project Search Functionality

This document explains how the search functionality for projects works in the AlternativeOSS platform.

## Overview

The search functionality uses PostgreSQL's full-text search capabilities to provide efficient and relevant search results. It searches across project names, summaries, and long descriptions with different weights for each field.

## How It Works

1. **Database Setup**: We use a `tsvector` column in the `projects` table to store pre-processed search data.
2. **Search Weights**: Different fields have different weights:
   - Project name (A): Highest priority
   - Summary (B): Medium priority
   - Long description (C): Lower priority
3. **Search Implementation**: We use both full-text search and fallback to ILIKE for partial matches.

## Running the Migration

To set up the search functionality, you need to run the search migration:

```bash
pnpm db:search-migration
```

This will:
1. Add a `search_vector` column to the `projects` table
2. Create a trigger to automatically update the search vector when projects are created or updated
3. Update existing records with search vectors
4. Create a GIN index for efficient searching

## Using the Search

The search functionality is integrated into the main page. Users can:

1. Type in the search box to search for projects
2. Results will update automatically as they type (with debouncing)
3. Search results maintain the current sorting preferences
4. Pagination works with search results

## Implementation Details

### Custom Hooks

The search functionality is implemented using custom hooks:

- `useDebounce`: A reusable hook that debounces any value with a specified delay
- `useSearch`: A hook that handles search functionality with URL search params

### Search Component

The search component (`src/components/toolbar/search.tsx`) is a client component that:
- Uses the `useSearch` hook to manage search state
- Updates the URL with the search query parameter (debounced)
- Resets pagination to page 1 when searching
- Provides immediate feedback to users with a loading indicator

### Search Logic

The search logic is implemented in:
- `src/data-access/project.ts`: Contains the database query logic
- `src/use-cases/project.ts`: Contains the business logic for searching
- `src/app/(main)/page.tsx`: Integrates the search with the UI

### Search Parameters

Search parameters are managed using the `nuqs` library, which provides type-safe URL search parameters.

## Performance Considerations

- The GIN index ensures efficient searching even with large datasets
- The search vector is updated automatically via a database trigger
- Caching is implemented to improve performance for repeated searches
- Debouncing prevents excessive database queries while typing 