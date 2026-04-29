# SDD Proposal: CantoManager Initial Setup

## Overview
This proposal covers the foundation of the **CantoManager** platform, a mobile-first web app for liturgical song management using Supabase as the backend.

## Proposed Scope
1.  **Project Initialization**: Set up a Vite + React + TypeScript project with Tailwind CSS.
2.  **Supabase Integration**: Configure the Supabase client and environment variables.
3.  **Database Schema (Core)**:
    *   Initialize `perfiles`, `cantos`, `sesiones`, and lookup tables (`tiempos_liturgicos`, `tipos_canto`, `usos_canto`, `tipos_celebracion`).
    *   Apply Row Level Security (RLS) policies as defined in the PRD.
    *   Set up the `handle_new_user` trigger for automatic profile creation.
4.  **Base UI Structure**:
    *   Configure `react-router-dom` for navigation.
    *   Create a base Layout with mobile-first bottom navigation.

## Technical Decisions
- **Framework**: Vite + React for speed and mobile-friendly rendering.
- **State Management**: React Query (TanStack Query) for efficient data fetching from Supabase.
- **UI Components**: Headless UI or Radix for accessibility + Tailwind for custom styling.
- **Auth**: Supabase Auth (Email/Password).

## Risks & Mitigations
- **RLS Complexity**: Testing policies early to ensure Admins have CRUD and Basic users have Read-only access.
- **PDF/Audio Hosting**: Initial phase will use external URLs (Google Drive), transitioning to Supabase Storage in Phase 1.5.

## Next Phase
**SDD Spec**: Detailed scenarios for Authentication, Song Browsing, and Session Management.
