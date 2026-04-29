# Specs: CantoManager Foundation

## Scenario: User Authentication (Login)
**GIVEN** a registered user with email "admin@example.com" and role "admin"
**WHEN** they enter their credentials in the login form
**THEN** the system MUST authenticate them via Supabase Auth
**AND** redirect them to the Dashboard
**AND** show the "Admin" features (e.g., "Add Song" button).

## Scenario: Listing Songs (Basic User)
**GIVEN** a collection of songs in the database
**WHEN** a "Basic" user navigates to the Songs list
**THEN** they MUST see a list of active songs
**AND** be able to filter by "Tiempo Litúrgico"
**AND** be able to search by title
**AND** they MUST NOT see any "Edit" or "Delete" buttons.

## Scenario: Creating a Song (Admin Only)
**GIVEN** an authenticated "Admin" user
**WHEN** they fill the "New Song" form with a title, liturgical time, and PDF URL
**THEN** the system MUST save the song to the `cantos` table
**AND** automatically associate the current user as the creator
**AND** show a success notification.

## Non-Functional Requirements
- **Performance**: The song list MUST load in less than 2 seconds.
- **Security**: The `cantos` table MUST have RLS enabled so only admins can INSERT/UPDATE.
- **Mobile-First**: The navigation MUST be via a bottom bar on screens smaller than 768px.
