import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';

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
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { roomId, checkIn, checkOut, guests, adults, children, specialRequests } = req.body;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) return res.status(404).json({ error: 'Room not found' });

    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = Number(room.price) * nights;

    const conflicting = await prisma.reservation.findMany({
      where: {
        roomId,
        status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
        OR: [{ checkIn: { lte: checkOutDate }, checkOut: { gte: checkInDate } }]
      }
    });

    if (conflicting.length > 0) {
      return res.status(400).json({ error: 'Room not available for selected dates' });
    }

    const reservation = await prisma.reservation.create({
      data: {
        userId: req.user!.userId,
        roomId,
        guestName: '',
        guestEmail: req.user!.email,
        guestPhone: '',
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        adults: adults || 2,
        children: children || 0,
        totalPrice,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        specialRequests
      }
    });

    res.json({ reservation: { id: reservation.id, checkIn: reservation.checkIn, checkOut: reservation.checkOut, totalPrice: reservation.totalPrice, status: reservation.status } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { userId: req.user!.userId },
      include: { room: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ reservations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

router.post('/payment', authenticate, async (req: AuthRequest, res: Response) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: 'Payment processing not configured' });
      }
      
      const { reservationId } = req.body;
      const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });

      if (!reservation || reservation.userId !== req.user!.userId) {
        return res.status(404).json({ error: 'Reservation not found' });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(Number(reservation.totalPrice) * 100),
        currency: 'eur',
        metadata: { reservationId: reservation.id }
      });

      await prisma.payment.create({
        data: {
          reservationId: reservation.id,
          amount: reservation.totalPrice,
          stripePaymentId: paymentIntent.id,
          status: 'PENDING'
        }
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Payment error:', error);
      res.status(500).json({ error: 'Payment failed' });
    }
  });

export default router;