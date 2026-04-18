# Citadel Hôtel - Luxury Hotel Website

A modern, responsive hotel management website built with Next.js and Express.

## Features

- **Frontend**: Next.js 16 with React 19, TypeScript, Tailwind CSS
- **Backend**: Express.js with PostgreSQL and Prisma ORM
- **Admin Panel**: Full Property Management System (PMS) with:
  - Room Management
  - Reservations
  - Staff Management
  - Housekeeping Tasks
  - Inventory Management
  - Media Library
  - And more...

- **Public Pages**:
  - Home with Hero slider (video + images)
  - Rooms with booking
  - Gallery
  - Dining
  - Experience
  - Contact with email form
  - Login/Admin

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
# Configure .env with your database
npx prisma migrate dev
npm run dev
```

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Express.js
- PostgreSQL
- Prisma ORM

## License

MIT