# Tasks: CantoManager Foundation

## Phase 1: Environment & Infra
- [ ] 1.1 Initialize Vite project with React and TypeScript.
- [ ] 1.2 Install dependencies: `@supabase/supabase-js`, `lucide-react`, `react-router-dom`, `tailwind-merge`.
- [ ] 1.3 Configure `.env.local` with Supabase URL and Anon Key.
- [ ] 1.4 Initialize Supabase client in `src/lib/supabase.ts`.

## Phase 2: Database & Security
- [ ] 2.1 Create lookup tables: `tiempos_liturgicos`, `tipos_canto`, etc.
- [ ] 2.2 Create `perfiles` and `cantos` tables.
- [ ] 2.3 Implement `handle_new_user` trigger.
- [ ] 2.4 Enable RLS and apply policies for `admin` vs `authenticated`.

## Phase 3: Core UI & Auth
- [ ] 3.1 Implement Login page using Supabase Auth.
- [ ] 3.2 Create `MainLayout` with `BottomNav` for mobile.
- [ ] 3.3 Create `SongList` component with search and filtering by Liturgical Time.
- [ ] 3.4 Create `AdminSongForm` for adding new songs (Admin only).

## Phase 4: Verification
- [ ] 4.1 Verify Login redirects correctly based on role.
- [ ] 4.2 Verify RLS prevents non-admins from saving songs.
- [ ] 4.3 Verify PDF links open in a new tab.
