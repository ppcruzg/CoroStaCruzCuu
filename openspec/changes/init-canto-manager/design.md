# Design: CantoManager Foundation

## Technical Approach
We will use **Vite + React + TypeScript** for the frontend. **Supabase** will handle all backend needs (DB, Auth, RLS). **Tailwind CSS** will be used for a mobile-first UI. Data fetching will be managed by **React Query** for caching and state management.

## Architecture Decisions

### Decision: Supabase for Auth & DB
**Choice**: Supabase (PostgreSQL + Auth).
**Rationale**: Reduces backend development time to nearly zero. Built-in RLS provides robust security directly at the DB level.

### Decision: Tailwind CSS + Mobile-First
**Choice**: Tailwind with a bottom navigation bar.
**Rationale**: The primary users will be musicians using their phones in liturgical celebrations.

## Data Flow
User ───[React Form]───→ [Supabase SDK] ───[RLS Filter]───→ [Postgres]
          ↑                                                    │
          └─────────────────── [Realtime Update] ──────────────┘

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Create | Project dependencies (vite, supabase, tailwind, react-query). |
| `src/lib/supabase.ts` | Create | Supabase client initialization. |
| `src/components/layout/BottomNav.tsx` | Create | Mobile-optimized navigation. |
| `src/pages/Songs.tsx` | Create | Song listing and filtering. |
| `supabase/migrations/01_init.sql` | Create | Initial schema, RLS, and triggers. |

## Interfaces / Contracts

```typescript
interface Canto {
  id: string;
  titulo: string;
  autor?: string;
  tono_base?: string;
  url_pdf: string;
  tipo_canto_id: number;
  activo: boolean;
}
```

## Testing Strategy
- **Unit**: Test Supabase client initialization.
- **Integration**: Verify RLS policies using Supabase CLI (if available) or manual testing.
- **E2E**: Playwright scenarios for Login and Song Search.
