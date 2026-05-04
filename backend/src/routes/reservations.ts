import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-02-24.acacia' });
}

interface AuthRequest extends Request {
  user?: { userId: string; email: string; role: string };
}

const authenticate = (req: AuthRequest, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.replace('Bearer ', '') : req.cookies['auth-token'];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    // Temporary: set dummy user
    req.user = { userId: 'USR001', email: 'john@example.com', role: 'GUEST' };
    const { roomId, checkIn, checkOut, guests, adults, children, specialRequests, guestName, guestEmail, guestPhone } = req.body;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Mock room check and price calculation
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = 150 * nights; // Mock price

    // Skip availability check for mock
  
// Migrate reservations from legacy flat file to nested folder structure
// If old file exists and new one doesn't, copy contents to new path.
(function migrateReservationsPath() {
  try {
    const legacy = path.join(__dirname, '../../data/reservations.json');
    const target = path.join(__dirname, '../../data/reservations/reservations.json');
    if (fs.existsSync(legacy) && !fs.existsSync(target)) {
      const data = fs.readFileSync(legacy, 'utf8');
      const dir = path.dirname(target);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(target, data);
      // NOTE: Intentionally not deleting legacy file to avoid data loss without explicit user instruction
      console.log('Migrated reservations.json to new nested path:', target);
    }
  } catch (e) {
    console.error('Failed to migrate reservations.json:', e);
  }
})();
 
  // Save to reservations.json (now inside data/reservations/)
  const reservationsFile = path.join(__dirname, '../../data/reservations/reservations.json');
    const reservationsDir = path.dirname(reservationsFile);
    // Ensure the data directory exists
    if (!fs.existsSync(reservationsDir)) {
      fs.mkdirSync(reservationsDir, { recursive: true });
    }
    let reservations = [];
    if (fs.existsSync(reservationsFile)) {
      const data = fs.readFileSync(reservationsFile, 'utf8');
      if (data.trim() !== '') {
        try {
          reservations = JSON.parse(data);
        } catch (e) {
          console.error('Error parsing reservations.json:', e);
          // If the file is corrupt, start fresh
          reservations = [];
        }
      }
    }

    const reservation = {
      id: 'RES-' + Date.now(),
      userId: req.user!.userId,
      roomId,
      guestName: guestName || 'Guest',
      guestEmail: guestEmail || req.user!.email,
      guestPhone: guestPhone || '',
      checkIn: checkInDate.toISOString(),
      checkOut: checkOutDate.toISOString(),
      guests,
      adults,
      children,
      totalPrice,
      status: 'CONFIRMED',
      paymentStatus: 'PENDING',
      specialRequests,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    reservations.push(reservation);
    fs.writeFileSync(reservationsFile, JSON.stringify(reservations, null, 2));

    res.json({ reservation });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
  // Get all reservations from JSON file
  const reservationsFile = path.join(__dirname, '../../data/reservations/reservations.json');
    let reservations = [];
    if (fs.existsSync(reservationsFile)) {
      const data = fs.readFileSync(reservationsFile, 'utf8');
      if (data.trim() !== '') {
        try {
          reservations = JSON.parse(data);
        } catch (e) {
          console.error('Error parsing reservations.json:', e);
          reservations = [];
        }
      }
    }
    res.json({ reservations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

router.post('/payment', authenticate, async (req: AuthRequest, res: Response) => {
    try {
      // Mock payment
      res.json({ clientSecret: 'mock_secret' });
    } catch (error) {
      res.status(500).json({ error: 'Payment failed' });
    }
  });

export default router;
