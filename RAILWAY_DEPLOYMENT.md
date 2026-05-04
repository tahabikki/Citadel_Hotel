# Railway Deployment Guide

This document explains how to deploy the Citadel Hotel application to Railway.

## Overview

The project has two parts:
- **Frontend**: Next.js application (React)
- **Backend**: Express API server (Node.js)

Both can be deployed to Railway as separate services that communicate via API.

## Prerequisites

1. GitHub account with the repo pushed
2. [Railway.app](https://railway.app) account (free tier available)
3. Environment variables ready

## Deployment Steps

### Step 1: Deploy Frontend to Railway

1. Go to [Railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub Repo"**
4. Connect your GitHub account and select `tahabikki/Citadel_Hotel`
5. In the deployment settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
   - **Framework**: Next.js (auto-detected)

6. Add Environment Variables in Railway:
   ```
   NEXT_PUBLIC_API_URL=https://<backend-railway-url>/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx (if using Stripe)
   ```

7. Click **"Deploy"**
8. Railway will build and deploy → You'll get a URL like `https://citadel-frontend.railway.app`

### Step 2: Deploy Backend to Railway

1. In Railway, create a **new service** or **new project**
2. Click **"Deploy from GitHub Repo"**
3. Select the same `tahabikki/Citadel_Hotel` repo
4. In the deployment settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`

5. Add Environment Variables:
   ```
   DATABASE_URL=postgresql://... (leave empty for now, using JSON mode)
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   PORT=3002 (Railway will auto-assign, this is fallback)
   FRONTEND_URL=https://citadel-frontend.railway.app
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   CONTACT_EMAIL=contact@citadel-hotel.com
   STRIPE_SECRET_KEY=sk_test_xxxxx (if using Stripe)
   ```

6. Click **"Deploy"**
7. Railway will provide a URL like `https://citadel-backend.railway.app`

### Step 3: Link Frontend to Backend

Once both are deployed:

1. Copy your **backend URL** from Railway (e.g., `https://citadel-backend.railway.app`)
2. Go to your **frontend service** settings in Railway
3. Update the `NEXT_PUBLIC_API_URL` environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://citadel-backend.railway.app/api
   ```
4. Railway will automatically redeploy the frontend

### Step 4: Verify Deployment

1. Visit your frontend URL
2. Try booking a room → it should call the backend API
3. Check Railway logs if anything fails

## Environment Variables Reference

**Frontend (.env):**
- `NEXT_PUBLIC_API_URL` - Backend API URL (required)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe key (optional)

**Backend (.env):**
- `DATABASE_URL` - PostgreSQL connection (optional, currently using JSON)
- `JWT_SECRET` - Secret for JWT tokens
- `NODE_ENV` - Set to `production`
- `FRONTEND_URL` - Frontend URL for CORS
- `SMTP_*` - Email configuration
- `STRIPE_SECRET_KEY` - Stripe secret (optional)

## Database Setup (Future)

When ready to use a real database:

1. In Railway, create a **PostgreSQL** service
2. Copy the `DATABASE_URL`
3. Add to backend environment variables
4. Update `backend/.env` or Railway env vars:
   ```
   DB=real
   DATABASE_URL=<copied-url>
   ```
5. Run Prisma migrations on the server

## Custom Domain (Optional)

1. In Railway project settings → Domains
2. Add your custom domain (e.g., `citadel-hotel.com`)
3. Update DNS records as instructed
4. SSL certificate is automatic

## Troubleshooting

**Build fails:**
- Check build logs in Railway dashboard
- Ensure `package.json` has proper `build` and `start` scripts

**API 500 errors:**
- Check backend logs in Railway
- Verify database connection (if using real DB)
- Ensure environment variables are set

**CORS errors:**
- Update `FRONTEND_URL` in backend env vars
- Check backend CORS configuration

**Images not loading:**
- Update image URLs to use Railway URLs
- Check `next.config.ts` for image domain configuration

## Monitoring

- Railway provides real-time logs in the dashboard
- Set up alerts for deployment failures
- Monitor disk usage (JSON files are limited to free tier storage)

## Costs

- **Free tier**: 5GB memory, 100GB bandwidth, suitable for MVP/demo
- **Paid**: $5/month per 1GB RAM, additional bandwidth charges

## Support

- Railway Docs: https://docs.railway.app
- GitHub Issues: Post any deployment issues in the repo

---

**Next Steps:**
1. Create Railway account
2. Deploy frontend
3. Deploy backend
4. Link them together
5. Test live!
