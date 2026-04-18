import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { checkIn, checkOut, guests, type } = req.query;

    const where: any = { available: true };

    if (type) where.type = type.toString().toUpperCase();
    if (guests) where.maxGuests = { gte: parseInt(guests.toString()) };

    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn.toString());
      const checkOutDate = new Date(checkOut.toString());

      const conflicting = await prisma.reservation.findMany({
        where: {
          status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
          OR: [
            { checkIn: { lte: checkOutDate }, checkOut: { gte: checkInDate } }
          ]
        },
        select: { roomId: true }
      });

      where.id = { notIn: conflicting.map(r => r.roomId) };
    }

    const rooms = await prisma.room.findMany({ where, orderBy: { price: 'asc' } });
    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
      const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
      const room = await prisma.room.findUnique({ where: { id } });
      if (!room) return res.status(404).json({ error: 'Room not found' });
      res.json({ room });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch room' });
    }
  });

export default router;