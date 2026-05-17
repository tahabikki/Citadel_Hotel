# ðŸ¨ Citadel Hotel - Modern Next.js + Supabase Stack

A modern, full-featured Hotel Property Management System built with Next.js 16, Supabase, and TypeScript.

## ðŸ— Architecture

### Modern Monorepo (2025 Standard)
```
citadel-hotel/
â”œâ”€â”€ frontend/                      # Next.js app (frontend + backend)
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ app/
â”‚   â”‚   â”‚   â”œâ”€â”€ api/              # API routes (replaces /backend)
â”‚   â”‚   â”‚   â”œâ”€â”€ admin/            # Admin dashboard
â”‚   â”‚   â”‚   â”œâ”€â”€ rooms/            # Room listing
â”‚   â”‚   â”‚   â”œâ”€â”€ reservations/     # Booking interface
â”‚   â”‚   â”‚   â””â”€â”€ ...
â”‚   â”‚   â”œâ”€â”€ components/           # React components
â”‚   â”‚   â”œâ”€â”€ lib/
â”‚   â”‚   â”‚   â”œâ”€â”€ supabase.ts       # Supabase client
â”‚   â”‚   â”‚   â”œâ”€â”€ supabase-storage.ts # File storage
â”‚   â”‚   â”‚   â”œâ”€â”€ prisma.ts         # Database client
â”‚   â”‚   â”‚   â””â”€â”€ services/         # Business logic
â”‚   â”‚   â””â”€â”€ styles/               # CSS/Tailwind
â”‚   â”œâ”€â”€ prisma/
â”‚   â”‚   â””â”€â”€ schema.prisma         # Database schema
â”‚   â””â”€â”€ package.json
â”œâ”€â”€ .env.local.example            # Environment template
â”œâ”€â”€ MIGRATION_GUIDE.md            # Architecture migration docs
â””â”€â”€ README.md                      # This file
```

## ðŸš€ Quick Start

### 1. Prerequisites
- Node.js 18+ and npm 8+
- Supabase account (free tier available)
- Stripe account (for payments)

### 2. Environment Setup
```bash
# Copy environment template
cp .env.local.example frontend/.env.local

# Edit with your Supabase credentials
```

### 3. Install & Run
```bash
# Install dependencies
npm install

# Setup database
cd frontend
npx prisma db push
npx prisma generate

# Run dev server
cd ..
npm run dev
```

Visit `http://localhost:3000`

## ðŸ“š Key Features

âœ… **Room Management** - Create, edit, manage room inventory  
âœ… **Reservations** - Book rooms with date range availability  
âœ… **Guest Management** - Track guest information and preferences  
âœ… **Payments** - Stripe integration for secure transactions  
âœ… **Staff Management** - Track staff roles, schedules, and departments  
âœ… **Housekeeping** - Task assignment and tracking  
âœ… **Inventory** - Manage minibar, linens, amenities  
âœ… **Pricing** - Seasonal rates and dynamic pricing  
âœ… **Media** - Upload and manage hotel images  
âœ… **Admin Dashboard** - Comprehensive management interface  

## ðŸ›  Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 | UI framework |
| **Framework** | Next.js 16 | Full-stack framework, API routes |
| **Database** | PostgreSQL (Supabase) | Data storage |
| **ORM** | Prisma | Type-safe database access |
| **Storage** | Supabase Storage | File/media management |
| **Payments** | Stripe | Payment processing |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Language** | TypeScript | Type safety |
| **Deployment** | Vercel/Railway | Hosting |

## ðŸ“ API Routes

All API endpoints are under `/api/*`:

```
POST   /api/auth                  # Register, Login, Logout
GET    /api/rooms                 # List rooms
POST   /api/rooms                 # Create room
PUT    /api/rooms/[id]            # Update room
DELETE /api/rooms/[id]            # Delete room

GET    /api/reservations          # List reservations
POST   /api/reservations          # Create reservation
PUT    /api/reservations/[id]     # Update reservation

GET    /api/payments              # List payments
POST   /api/payments              # Create payment

GET    /api/staff                 # List staff
POST   /api/staff                 # Add staff member
PUT    /api/staff/[id]            # Update staff

POST   /api/media                 # Upload file
GET    /api/media                 # List media
DELETE /api/media/[id]            # Delete file

GET    /api/housekeeping          # List housekeeping tasks
POST   /api/housekeeping          # Create task

GET    /api/inventory             # List inventory
POST   /api/inventory             # Add item

GET    /api/pricing               # List pricing rules
POST   /api/pricing               # Create pricing rule

GET    /api/contact               # List contact submissions
POST   /api/contact               # Submit contact form
```

## ðŸ—„ Database Schema

The Prisma schema includes:

- **User** - Guests and staff accounts
- **Room** - Hotel rooms with types and amenities
- **Reservation** - Bookings with guest info
- **Payment** - Stripe payments tied to reservations
- **Task** - Card access and room tasks
- **Staff** - Employee records with roles
- **HousekeepingTask** - Cleaning and maintenance
- **InventoryItem** - Hotel supplies and minibar
- **SeasonalRate** - Dynamic pricing
- **Media** - Images and files
- **Contact** - Inquiry submissions

See `frontend/prisma/schema.prisma` for full schema.

## ðŸ“– Usage Examples

### Fetch Rooms
```typescript
const response = await fetch('/api/rooms?checkIn=2025-05-10&checkOut=2025-05-12&guests=2');
const rooms = await response.json();
```

### Create Reservation
```typescript
const res = await fetch('/api/reservations', {
  method: 'POST',
  body: JSON.stringify({
    userId: 'user-123',
    roomId: 'room-456',
    checkIn: '2025-05-10',
    checkOut: '2025-05-12',
    totalPrice: 300
  })
});
```

### Upload Image
```typescript
const formData = new FormData();
formData.append('file', imageFile);
const response = await fetch('/api/media', {
  method: 'POST',
  body: formData
});
const { url } = await response.json();
```

### Query Database (Server-side)
```typescript
import { prisma } from '@/lib/prisma';

const bookings = await prisma.reservation.findMany({
  where: { status: 'CONFIRMED' },
  include: { guest: true, room: true }
});
```

## ðŸ”§ Configuration

### Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=postgresql://user:password@host/db

# Authentication
JWT_SECRET=your_jwt_secret_key

# Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Environment
NODE_ENV=development
```

## ðŸš€ Deployment

### Vercel (Recommended)
```bash
# Push to GitHub
git push origin main

# Connect to Vercel at https://vercel.com
# Set environment variables in Vercel dashboard
# Deploy automatically
```

### Railway.app
```bash
# Deploy with Railway CLI
railway login
railway init
railway link
railway up
```

### Self-hosted
```bash
# Build
npm run build

# Start
npm run start
```

## ðŸ“Š Development

### Scripts
```bash
npm run dev         # Start dev server (http://localhost:3000)
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run linter
npm run db:push    # Sync schema with database
npm run db:studio  # Open Prisma Studio
```

### Database Management
```bash
cd frontend
npx prisma db push          # Push schema changes
npx prisma generate        # Regenerate Prisma client
npx prisma studio          # Open browser IDE
npx prisma db seed         # Seed database
```

## ðŸ” Security

âœ… Type-safe database queries (Prisma)  
âœ… Server-side rendering for sensitive data  
âœ… Environment variables for secrets  
âœ… CORS configured for API security  
âœ… Stripe PCI compliance  
âœ… Input validation on routes  

## ðŸ“š Documentation

- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - From traditional to modern architecture
- **[Supabase Docs](https://supabase.com/docs)** - Database & storage
- **[Next.js Docs](https://nextjs.org/docs)** - Framework
- **[Prisma Docs](https://www.prisma.io/docs)** - ORM

## ðŸ› Troubleshooting

### Port already in use
```bash
# Change port
npm run dev -- -p 3001
```

### Database connection failed
- Verify DATABASE_URL in .env.local
- Check Supabase database is running
- Confirm network/firewall allows connections

### Prisma client issues
```bash
cd frontend
npx prisma generate
npx prisma db push
```

### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## ðŸ“ License

Private project - Citadel Hotel Management System

## ðŸ‘¨â€ðŸ’¼ Team

**Author**: Taha Bikki  
**Project**: Citadel Hotel PMS  
**Version**: 2.0.0 (Modern Stack)  

---

**Last Updated**: May 2025  
**Architecture**: Next.js 16 + Supabase (Modern Monorepo)

## Add a New Module

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
