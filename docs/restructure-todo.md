# Restructure TODO (Template-Aligned, Migration-Safe)

Use this checklist in order. Do not skip phases.

## Phase 0 - Baseline and Safety

- [ ] Create a backup branch before restructuring.
- [ ] Confirm app still runs before any move:
  - root: npm run dev
  - frontend only: npm --prefix frontend run dev
- [ ] Document current API endpoints used by frontend (auth, rooms, reservations, media, etc.).
- [ ] Freeze new feature work until Phase 4 is complete.

Definition of done:
- You can run the project and capture a "before" baseline.

---

## Phase 1 - Target Folder Scaffold

Goal: Introduce target structure without deleting old code.

- [x] Create root folders:
  - data
  - shared/types
  - shared/schemas
  - scripts
- [x] Create backend target folders (inside existing backend):
  - backend/api
  - backend/lib
  - backend/lib/storage
  - backend/models
  - backend/services
  - backend/utils
  - backend/uploads/images
  - backend/uploads/files
- [x] Keep existing frontend structure, but prepare these folders if missing:
  - frontend/src/services
  - frontend/src/hooks
  - frontend/src/utils
  - frontend/src/styles
  - frontend/src/components/features

Definition of done:
- Full template directories exist with no runtime impact yet.

---

## Phase 2 - Data Layout Unification

Goal: Move JSON to one temporary DB location at root data.

- [x] Choose one JSON source of truth (root data only).
- [x] Move/copy JSON datasets from backend/data and database into root data.
- [x] Normalize naming to collection files (example: rooms.json, reservations.json, users.json, media.json).
- [x] Add data/_meta.json for version and migration notes.
- [x] Update all JSON readers to only read root data.
- [x] Deprecate duplicate JSON locations (backend/data, database) after verification.

Definition of done:
- All read/write operations point to root data only.

---

## Phase 3 - DB Abstraction Layer

Goal: Add swappable JSON vs real DB backend.

- [x] Create backend/lib/json-db.ts with read/write collection helpers.
- [x] Create backend/lib/real-db.ts as real DB adapter (Prisma or other).
- [x] Create backend/lib/db.ts selector:
  - DB=json uses json-db
  - DB=real uses real-db
- [x] Refactor existing services to use backend/lib/db.ts only.
- [x] Remove filesystem access from services.

Definition of done:
- Services do not know whether data comes from JSON or real DB.

---

## Phase 4 - Storage Abstraction (Media)

Goal: Decouple upload logic from local filesystem.

- [x] Create backend/lib/storage/local-storage.ts.
- [x] Create backend/lib/storage/cloud-storage.ts.
- [x] Create backend/lib/storage/index.ts selector:
  - STORAGE=local uses local-storage
  - STORAGE=cloud uses cloud-storage
- [x] Create backend/services/uploadService.ts using storage abstraction.
- [x] Ensure uploads are written only to backend/uploads in local mode.
- [x] Add backend/uploads to gitignore (dev-only artifacts).

Definition of done:
- Upload service works locally and can switch to cloud without API changes.

---

## Phase 5 - Thin API Controllers

Goal: Keep routes thin and move business logic to services.

- [x] For each API endpoint, keep only:
  - request parsing
  - validation
  - service call
  - response mapping
- [x] Move business rules from API route files into backend/services for core routes (auth, rooms, tasks, payments, admin reservations).
- [x] Ensure no direct filesystem usage inside routes.
- [x] Ensure no heavy business logic in route handlers.

Definition of done:
- API files are thin controllers only.

---

## Phase 6 - Model and Shared Contracts

Goal: Centralize domain types and validation.

- [x] Add backend/models for main entities (Room, Reservation, User, Media, etc.).
- [x] Add shared/types for frontend-backend contract types.
- [x] Add shared/schemas for validation schemas.
- [x] Replace duplicated type definitions in frontend/lib/data.ts with shared contracts.

Definition of done:
- Types are not duplicated across backend and frontend.

---

## Phase 7 - Frontend Service Layer Cleanup

Goal: Standardize frontend data access.

- [ ] Keep one API client in frontend/src/services/apiClient.ts.
- [ ] Split feature services:
  - frontend/src/services/roomService.ts
  - frontend/src/services/reservationService.ts
  - frontend/src/services/userService.ts
  - frontend/src/services/uploadService.ts
- [ ] Move fetch logic out of UI components and page files into services.
- [ ] Ensure frontend never hardcodes media storage paths.

Definition of done:
- Frontend uses service layer consistently.

---

## Phase 8 - Environment and Config

Goal: Make switching infra explicit and safe.

- [x] Add/update env variables:
  - DB=json
  - STORAGE=local
- [x] Add production values guide:
  - DB=real
  - STORAGE=cloud
- [x] Document all required env vars in README.
- [x] Validate startup behavior when env vars are missing.

Definition of done:
- Environment clearly controls DB and storage provider.

---

## Phase 9 - Migration and Seed Scripts

Goal: Prepare JSON to DB migration path.

- [ ] Create scripts/migrate-json-to-db.ts.
- [ ] Create scripts/seed.ts.
- [ ] Add root package scripts for migration and seed.
- [ ] Make migration idempotent where possible.

Definition of done:
- You can move data from JSON to real DB with scripts.

---

## Phase 10 - README and Architecture Docs

Goal: Keep documentation aligned with reality.

- [x] Update root README to match actual architecture.
- [x] Document request flow: route -> service -> db/storage adapter.
- [x] Add a short "How to add a new module" guide.
- [x] Add non-negotiable constraints section:
  - no uploads in public
  - no business logic in routes
  - no fs access in services
  - no hardcoded storage paths in frontend

Definition of done:
- New contributors can follow docs and build correctly.

---

## Phase 11 - Validation and Cutover

Goal: Complete migration with low risk.

- [ ] Run full smoke test of key flows:
  - login
  - room list/search
  - reservation create
  - media upload
  - admin CRUD
- [ ] Compare behavior against baseline from Phase 0.
- [ ] Remove deprecated folders/files only after successful smoke test.
- [ ] Tag this as "architecture-stable" milestone.

Definition of done:
- No regressions in core flows after restructure.

---

## Priority Labels

- P0: Phases 0 to 5 (must finish first)
- P1: Phases 6 to 8
- P2: Phases 9 to 11

---

## Immediate Next 5 Tasks (Start Here)

- [x] Scaffold backend/lib, backend/api, shared, scripts, and root data folders.
- [x] Consolidate JSON into root data and point json service there.
- [x] Implement backend/lib/db.ts + json-db.ts + real-db.ts adapters.
- [x] Implement backend/lib/storage + uploadService abstraction.
- [x] Refactor one endpoint end-to-end as reference (suggest: media upload).
