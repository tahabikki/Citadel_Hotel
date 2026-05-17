# ðŸ— Project Structure - Modern Next.js Monorepo Best Practices

## ðŸ“ Optimized Clean Structure

```
citadel-hotel/
â”œâ”€â”€ app/                                   # Main Next.js Application
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ app/                          # App Router (Next.js 13+)
â”‚   â”‚   â”‚   â”œâ”€â”€ (public)/                 # PUBLIC PAGES - Route Group
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ page.tsx              # Home page (/)
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ login/
â”‚   â”‚   â”‚   â”‚   â”‚   â””â”€â”€ page.tsx          # Login page (/login)
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ rooms/
â”‚   â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ page.tsx          # Rooms listing (/rooms)
â”‚   â”‚   â”‚   â”‚   â”‚   â””â”€â”€ RoomsClient.tsx
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ checkout/
â”‚   â”‚   â”‚   â”‚   â”‚   â””â”€â”€ page.tsx          # Booking checkout (/checkout)
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ confirmation/
â”‚   â”‚   â”‚   â”‚   â”‚   â””â”€â”€ page.tsx          # Booking confirmation (/confirmation)
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ gallery/
â”‚   â”‚   â”‚   â”‚   â”‚   â””â”€â”€ page.tsx          # Gallery (/gallery)
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ dining/
â”‚   â”‚   â”‚   â”‚   â”‚   â””â”€â”€ page.tsx          # Dining info (/dining)
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ experience/
â”‚   â”‚   â”‚   â”‚   â”‚   â””â”€â”€ page.tsx          # Experiences (/experience)
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ offers/
â”‚   â”‚   â”‚   â”‚   â”‚   â””â”€â”€ page.tsx          # Special offers (/offers)
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ contact/
â”‚   â”‚   â”‚   â”‚   â”‚   â””â”€â”€ page.tsx          # Contact form (/contact)
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ globals.css           # Global styles
â”‚   â”‚   â”‚   â”‚
â”‚   â”‚   â”‚   â”œâ”€â”€ (admin)/                  # ADMIN PANEL - Route Group
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ admin/
â”‚   â”‚   â”‚   â”‚   â”‚   â””â”€â”€ page.tsx          # Admin dashboard (/admin)
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ [admin-routes]/       # Additional admin routes
â”‚   â”‚   â”‚   â”‚
â”‚   â”‚   â”‚   â”œâ”€â”€ api/                      # API ROUTES - Backend
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ auth/
â”‚   â”‚   â”‚   â”‚   â”‚   â””â”€â”€ route.ts          # /api/auth
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ rooms/
â”‚   â”‚   â”‚   â”‚   â”‚   â””â”€â”€ route.ts          # /api/rooms
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ reservations/
â”‚   â”‚   â”‚   â”‚   â”‚   â””â”€â”€ route.ts          # /api/reservations
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ payments/
â”‚   â”‚   â”‚   â”‚   â”‚   â””â”€â”€ route.ts          # /api/payments
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ staff/
â”‚   â”‚   â”‚   â”‚   â”‚   â””â”€â”€ route.ts          # /api/staff
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ housekeeping/
â”‚   â”‚   â”‚   â”‚   â”‚   â””â”€â”€ route.ts          # /api/housekeeping
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ inventory/
â”‚   â”‚   â”‚   â”‚   â”‚   â””â”€â”€ route.ts          # /api/inventory
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ pricing/
â”‚   â”‚   â”‚   â”‚   â”‚   â””â”€â”€ route.ts          # /api/pricing
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ contact/
â”‚   â”‚   â”‚   â”‚   â”‚   â””â”€â”€ route.ts          # /api/contact
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ media/
â”‚   â”‚   â”‚   â”‚   â”‚   â””â”€â”€ route.ts          # /api/media
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ admin/
â”‚   â”‚   â”‚   â”‚   â”‚   â””â”€â”€ route.ts          # /api/admin
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ tasks/
â”‚   â”‚   â”‚   â”‚       â””â”€â”€ route.ts          # /api/tasks
â”‚   â”‚   â”‚   â”‚
â”‚   â”‚   â”‚   â””â”€â”€ layout.tsx                # Root layout (shared by all routes)
â”‚   â”‚   â”‚
â”‚   â”‚   â”œâ”€â”€ components/                   # Reusable React Components
â”‚   â”‚   â”‚   â”œâ”€â”€ AboutSection.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ Navbar.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ Footer.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ AuthProvider.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ ThemeProvider.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ LanguageContext.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ FloatingWidgets.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ ScrollProgress.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ BookingSection.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ RoomsSection.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ OffersSection.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ TestimonialsSection.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ ScrollReveal.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ CitadelDetailsStatic.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ HeroSection.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ features/
â”‚   â”‚   â”‚   â””â”€â”€ ...
â”‚   â”‚   â”‚
â”‚   â”‚   â”œâ”€â”€ lib/                         # Library Functions & Configs
â”‚   â”‚   â”‚   â”œâ”€â”€ supabase.ts              # Supabase client initialization
â”‚   â”‚   â”‚   â”œâ”€â”€ supabase-storage.ts      # File upload/storage utilities
â”‚   â”‚   â”‚   â”œâ”€â”€ prisma.ts                # Prisma ORM client
â”‚   â”‚   â”‚   â”œâ”€â”€ auth.ts                  # Auth utilities & middleware
â”‚   â”‚   â”‚   â”œâ”€â”€ api.ts                   # API client for fetch
â”‚   â”‚   â”‚   â”œâ”€â”€ data.ts                  # Data fetching utilities
â”‚   â”‚   â”‚   â”œâ”€â”€ images.ts                # Image optimization
â”‚   â”‚   â”‚   â””â”€â”€ services/                # Business Logic Services
â”‚   â”‚   â”‚       â”œâ”€â”€ apiClient.ts
â”‚   â”‚   â”‚       â”œâ”€â”€ authApiService.ts
â”‚   â”‚   â”‚       â”œâ”€â”€ contactService.ts
â”‚   â”‚   â”‚       â”œâ”€â”€ mediaService.ts
â”‚   â”‚   â”‚       â”œâ”€â”€ reservationService.ts
â”‚   â”‚   â”‚       â”œâ”€â”€ roomService.ts
â”‚   â”‚   â”‚       â”œâ”€â”€ paymentService.ts
â”‚   â”‚   â”‚       â””â”€â”€ ...
â”‚   â”‚   â”‚
â”‚   â”‚   â”œâ”€â”€ hooks/                       # Custom React Hooks
â”‚   â”‚   â”‚   â””â”€â”€ ...
â”‚   â”‚   â”‚
â”‚   â”‚   â”œâ”€â”€ styles/                      # Additional CSS/SCSS
â”‚   â”‚   â”‚   â””â”€â”€ ...
â”‚   â”‚   â”‚
â”‚   â”‚   â””â”€â”€ utils/                       # Utility Functions
â”‚   â”‚       â””â”€â”€ ...
â”‚   â”‚
â”‚   â”œâ”€â”€ prisma/
â”‚   â”‚   â””â”€â”€ schema.prisma                # Prisma Database Schema (PostgreSQL)
â”‚   â”‚
â”‚   â”œâ”€â”€ public/                          # Static Assets (served at root)
â”‚   â”‚   â”œâ”€â”€ logo/
â”‚   â”‚   â”œâ”€â”€ api-data/
â”‚   â”‚   â””â”€â”€ uploads/                     # Generated media files
â”‚   â”‚
â”‚   â”œâ”€â”€ .env                             # Local environment (gitignored)
â”‚   â”œâ”€â”€ .env.local.example               # Environment template
â”‚   â”œâ”€â”€ .gitignore                       # Git ignore rules
â”‚   â”œâ”€â”€ next.config.ts                   # Next.js configuration
â”‚   â”œâ”€â”€ tsconfig.json                    # TypeScript configuration
â”‚   â”œâ”€â”€ package.json                     # App dependencies
â”‚   â””â”€â”€ package-lock.json                # Lock file
â”‚
â”‚   â”œâ”€â”€ schemas/
â”‚   â”‚   â”œâ”€â”€ domain.ts
â”‚   â”‚   â””â”€â”€ index.ts
â”‚   â””â”€â”€ types/
â”‚       â”œâ”€â”€ domain.ts
â”‚       â””â”€â”€ index.ts
â”‚
â”œâ”€â”€ node_modules/                        # Root dependencies (minimal)
â”œâ”€â”€ .env.local.example                   # Root environment template
â”œâ”€â”€ .gitignore                           # Global git ignore
â”œâ”€â”€ package.json                         # Root package (scripts only)
â”œâ”€â”€ README.md                            # Project overview
â”œâ”€â”€ MIGRATION_GUIDE.md                   # Architecture migration docs
â”œâ”€â”€ DEPLOYMENT.md                        # Setup & deployment guide
â””â”€â”€ PROJECT_STRUCTURE.md                 # This file
```

## ðŸŽ¯ Route Groups Explained

Route groups `(parentheses)` organize code without affecting URLs:

### (public) - Customer Website
- **URL**: `/` (no prefix)
- **Routes**: `/`, `/login`, `/rooms`, `/checkout`, `/gallery`, etc.
- **Purpose**: Customer-facing pages and features
- **Layout**: Shared header, footer, theme

### (admin) - Admin Dashboard  
- **URL**: `/admin`
- **Routes**: `/admin`, `/admin/users`, `/admin/reports`, etc.
- **Purpose**: Internal management and administration
- **Layout**: Admin sidebar, navigation, permissions

### api - Backend Endpoints
- **URL**: `/api/*`
- **Routes**: `/api/rooms`, `/api/payments`, `/api/auth`, etc.
- **Purpose**: Data endpoints for frontend + external integrations
- **No Layout**: Returns JSON/data only

## ðŸ“Š Folder Organization

| Folder | Purpose | Contains |
|--------|---------|----------|
| `app/` | Main Next.js application | All code except shared types |
| `app/src/app/(public)/` | Public pages | Website pages, routes |
| `app/src/app/(admin)/` | Admin pages | Dashboard, management |
| `app/src/app/api/` | API endpoints | Backend routes, data |
| `app/src/components/` | React components | Reusable UI parts |
| `app/src/lib/` | Utilities & clients | Core business logic |
| `app/src/lib/services/` | Services | Feature-specific logic |
| `app/src/hooks/` | Custom hooks | React hooks |
| `app/prisma/` | Database | Schema, migrations |
| `app/public/` | Static files | Images, logos, icons |

## âœ¨ Key Features

### 1. **Logical Organization**
- Public pages in `(public)` route group
- Admin pages in `(admin)` route group  
- API endpoints in `api` directory
- Clear separation of concerns

### 2. **Scalability**
- Easy to add new features
- Route groups prevent URL clutter
- Services encapsulate logic

### 3. **Type Safety**
- Full TypeScript coverage
- Prisma auto-generates types
- Path aliases for clean imports

### 4. **Modern Best Practices**
- App Router (Next.js 13+)
- Server Components by default
- Route groups for organization
- Service layer for business logic

## ðŸ”— Import Paths

Use these path aliases (configured in `tsconfig.json`):

```typescript
// âœ… Correct
import { prisma } from '@/lib/prisma'
import { MyComponent } from '@/components/MyComponent'
import { useAuth } from '@/hooks/useAuth'
import { roomService } from '@/lib/services/roomService'

// âŒ Avoid
import { prisma } from '../../../lib/prisma'
import Component from './MyComponent'
```

## ðŸ“ File Naming Convention

```
Components:      PascalCase          UserCard.tsx
Pages:          page.tsx            app/(public)/rooms/page.tsx
API Routes:     route.ts            app/api/rooms/route.ts
Layouts:        layout.tsx          app/layout.tsx
Utilities:      camelCase           formatDate.ts
Hooks:          useXxx              useAuth.ts
Services:       xxxService.ts       roomService.ts
Types:          PascalCase          User.ts
Constants:      UPPER_CASE          API_ROUTES.ts
```

## ðŸš€ How to Add Features

### New Public Page
```bash
mkdir -p app/src/app/(public)/new-page
# Create: app/src/app/(public)/new-page/page.tsx
export default function Page() {
  return <h1>New Page</h1>
}
```

### New API Route
```bash
mkdir -p app/src/app/api/new-endpoint
# Create: app/src/app/api/new-endpoint/route.ts
export async function GET() {
  return Response.json({ data: [] })
}
```

### New Component
```bash
# Create: app/src/components/NewComponent.tsx
export function NewComponent() {
  return <div>Component</div>
}
```

### New Service
```bash
# Create: app/src/lib/services/newService.ts
import { prisma } from '@/lib/prisma'

export const newService = {
  getAll: () => prisma.model.findMany(),
  create: (data) => prisma.model.create({ data }),
}
```

## ðŸ”„ Data Flow

```
User Browser
    â†“
(public) or (admin) Page Component
    â†“
Calls Service Function (@/lib/services)
    â†“
Service Uses Prisma
    â†“
Prisma Queries Database (Supabase)
    â†“
Data Returns to Component
    â†“
HTML Rendered to User
```

API routes follow similar pattern:
```
HTTP Request â†’ /api/endpoint
    â†“
route.ts Handler
    â†“
Service Function
    â†“
Prisma Query
    â†“
JSON Response
```

## âœ… Best Practices Checklist

- [ ] Pages in `(public)` or `(admin)` groups
- [ ] API routes in `api/` directory
- [ ] Components in `components/` folder
- [ ] Services in `lib/services/`
- [ ] Database queries via Prisma only
- [ ] Environment variables in `.env.local`
- [ ] No loose files at app root
- [ ] Import paths use `@/` aliases

---

**Status**: âœ¨ Optimized for Production  
**Architecture**: Modern Next.js 16 Monorepo  
**Route Groups**: âœ… Properly Organized  
**Type Safety**: âœ… Full TypeScript  
**Scalability**: âœ… Ready for Growth  
**Ready to Deploy**: âœ… Yes!
