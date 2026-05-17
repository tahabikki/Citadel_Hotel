# Citadel Hôtel: Supabase + Vercel Setup

## Target Architecture

- **Next.js app** in `app/` serves the website and all `/api/*` CRUD routes.
- **Supabase Postgres** stores PMS data: rooms, reservations, users, contacts, media records, payments, tasks, staff, housekeeping, inventory, and pricing.
- **Supabase Storage** stores uploaded images/files in the `hotel-media` bucket.
- **Vercel** hosts the Next.js app. It should not be used as a file/database server.

## Local Setup With Supabase

```bash
cd app
npm install
copy .env.example .env.local
```

Fill `app/.env.local`:

```bash
DB=supabase
STORAGE=cloud
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
```

Then create/update the database:

```bash
cd app
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

When the Supabase Storage bucket is ready, upload local hotel assets and connect room images:

```bash
cd app
npm run storage:migrate
```

## Supabase Storage

1. Create a bucket named `hotel-media`.
2. Use public read access for public hotel/gallery images.
3. Keep admin upload writes protected by your API route.
4. Set `STORAGE=cloud` so `/api/upload` writes to Supabase Storage.

## Vercel Deployment

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Set Vercel **Root Directory** to `app`.
4. Add the same Supabase environment variables in Vercel.
5. Deploy.

## Important

- Runtime CRUD no longer uses `backend/data/*.json`.
- Existing local images can stay in `app/public/uploads/media/hotel` during development, then move to Supabase Storage when ready.
- After moving images to Supabase Storage, update room `images` URLs in Supabase to the public storage URLs.
