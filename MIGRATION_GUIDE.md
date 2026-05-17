# Modern Next.js + Supabase Migration Guide

## Architecture Migration: Traditional Full-Stack → Modern Next.js Monorepo

This guide documents the migration from a traditional frontend/backend architecture to a modern Next.js-based monorepo using Supabase.

### What Changed

#### Old Architecture
```
- frontend/ (Next.js React app)
- backend/ (Express API server on port 3002)
- Separate database and storage systems
- JWT-based custom authentication
```

#### New Architecture
```
- frontend/ (Next.js App Router with integrated API routes)
  - src/app/api/ (All API endpoints)
  - src/lib/supabase* (Database & storage clients)
- No separate backend folder
- Supabase PostgreSQL database
- Supabase Storage for media files
- Supabase Auth integration (optional)
- Single deployment unit
```

### Key Benefits
✅ **Simpler Deployment** - Single app instead of two  
✅ **Better Performance** - No network latency between frontend/backend  
✅ **Reduced Complexity** - One codebase to manage  
✅ **Modern Stack** - Industry standard approach  
✅ **Supabase Features** - Realtime, Auth, Storage, Edge Functions  

### Setup Instructions

#### 1. Prerequisites
- Create a Supabase account at https://supabase.com
- Create a new project and get your credentials

#### 2. Environment Variables
Copy `.env.local.example` to `.env.local` and fill in:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=postgresql://user:password@host/database
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
```

#### 3. Database Migration
```bash
# Install dependencies
npm install

# Generate Prisma client
cd frontend
npx prisma generate

# Push schema to Supabase
npx prisma db push

# (Optional) Seed database
npx prisma db seed
```

#### 4. Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000` with all API routes under `/api/*`

### API Routes Organization

All API endpoints are now in `frontend/src/app/api/`:

```
api/
├── auth/
│   └── route.ts          # Login, Register, Logout
├── rooms/
│   └── route.ts          # Room CRUD operations
├── reservations/
│   └── route.ts          # Reservation management
├── payments/
│   └── route.ts          # Stripe payments
├── staff/
│   └── route.ts          # Staff management
├── tasks/
│   └── route.ts          # Task management
├── housekeeping/
│   └── route.ts          # Housekeeping tasks
├── inventory/
│   └── route.ts          # Inventory management
├── pricing/
│   └── route.ts          # Pricing rules
├── contact/
│   └── route.ts          # Contact form submissions
├── media/
│   └── route.ts          # File uploads & management
└── admin/
    └── route.ts          # Admin operations
```

### Database Access

#### Prisma Client
```typescript
import { prisma } from '@/lib/prisma';

// Query rooms
const rooms = await prisma.room.findMany();
```

#### Supabase Storage
```typescript
import { uploadFile, deleteFile } from '@/lib/supabase-storage';

// Upload media
const url = await uploadFile(file, 'room-images');
```

### Authentication (Legacy JWT → Modern Supabase)

Current implementation uses JWT tokens. To migrate to Supabase Auth:

1. Update `src/lib/auth.ts` to use Supabase Auth
2. Replace password hashing with Supabase's auth system
3. Update `AuthProvider` component

### Migration Checklist

- [x] Update root package.json scripts
- [x] Add Supabase dependencies to frontend
- [x] Create Supabase configuration files
- [x] Update Prisma schema for PostgreSQL
- [x] Create Supabase storage utilities
- [x] Create environment variable template
- [ ] Verify all API routes work with Supabase
- [ ] Test database queries with Prisma
- [ ] Test file uploads with Supabase Storage
- [ ] Update frontend API client calls
- [ ] Migrate authentication system
- [ ] Test all features end-to-end
- [ ] Deploy to Vercel/production

### Common Tasks

#### Uploading Files
```typescript
import { uploadFile } from '@/lib/supabase-storage';

const file = e.target.files[0];
const url = await uploadFile(file, 'room-images');
```

#### Querying Database
```typescript
import { prisma } from '@/lib/prisma';

const reservations = await prisma.reservation.findMany({
  where: { status: 'PENDING' },
  include: { user: true, room: true }
});
```

#### API Routes
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const data = await prisma.room.findMany();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const room = await prisma.room.create({ data: body });
  return NextResponse.json(room);
}
```

### Deployment

The app is now ready for modern deployment platforms:

**Vercel (Recommended)**
```bash
# Connect your GitHub repo to Vercel
# Set environment variables in Vercel dashboard
# Deploy automatically on push
```

**Other Options**
- Railway.app
- Fly.io
- Docker + your own server

### Troubleshooting

**Q: "MODULE_NOT_FOUND" errors after migration**
A: Run `npm install` in the root and `frontend/` directories

**Q: Database connection failed**
A: Check DATABASE_URL in .env.local matches your Supabase connection string

**Q: File uploads not working**
A: Verify NEXT_PUBLIC_SUPABASE_URL and bucket name "hotel-media" exists in Supabase Storage

**Q: API routes returning 500 errors**
A: Check server logs: `npm run dev` with verbose output

### Next Steps

1. Set up Supabase project
2. Configure environment variables
3. Push database schema
4. Test API endpoints
5. Update frontend to call new routes
6. Deploy!

---

For questions or issues, refer to:
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
