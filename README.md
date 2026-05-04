# Citadel Hôtel

Citadel Hôtel is a Next.js frontend with a small backend utility layer for JSON data, upload storage, and future database migration.

## Architecture

- Frontend app: [frontend/](frontend)
- Backend utilities and adapters: [backend/](backend)
- Temporary JSON source of truth: [data/](data)
- Shared contracts and models: [shared/](shared)
- Dev-only upload target: [backend/uploads/](backend/uploads)

## Runtime Modes

The app is controlled by environment variables:

- `DB=json` uses the root JSON data store.
- `DB=real` switches the data layer to the database adapter.
- `STORAGE=local` writes uploads to `backend/uploads`.
- `STORAGE=cloud` switches uploads to the cloud adapter.
- `NEXT_PUBLIC_API_URL` overrides the frontend API base when needed.

See [.env.example](.env.example) for the current defaults.

## Request Flow

1. Route handler parses the request.
2. Route calls a service in `frontend/src/lib/services`.
3. Service uses Prisma, the JSON DB adapter, or the storage selector.
4. Adapter performs the actual read/write.

## Add a New Module

1. Define the domain shape in `shared/types` and, if needed, a validator in `shared/schemas`.
2. Add the backend or frontend service that owns the business logic.
3. Keep the route or UI layer thin and call the service instead of duplicating rules.
4. Use the storage or DB adapter layer for persistence concerns.

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

For the current migration setup, keep `DB=json` and `STORAGE=local` while developing.

## Constraints

- No uploads in public storage paths.
- No business logic in API routes.
- No direct filesystem access in services.
- No hardcoded storage paths in the frontend.