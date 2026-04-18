import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

const authenticate = (req: AuthRequest, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  const token = authHeader.replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: req.user!.role === 'ADMIN' || req.user!.role === 'STAFF' ? {} : { userId: req.user!.userId },
      include: {
        reservation: { include: { room: true, user: { select: { firstName: true, lastName: true, email: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { reservationId, type } = req.body;
    const reservation = await prisma.reservation.findUnique({ where: { id: reservationId }, include: { room: true } });

    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });

    const validFrom = new Date();
    const validUntil = type === 'CREATE_CARD' ? reservation.checkOut : new Date();

    const task = await prisma.task.create({
      data: {
        reservationId,
        userId: reservation.userId,
        type: type.toUpperCase(),
        status: 'PENDING',
        roomNumber: reservation.room.roomNumber,
        accessLevel: 1,
        validFrom,
        validUntil
      }
    });

    res.json({ task });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

router.patch('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
      const { status, result, errorMessage } = req.body;
      const updateData: any = {};

      if (status) {
        updateData.status = status.toUpperCase();
        if (status === 'COMPLETED') updateData.completedAt = new Date();
      }
      if (result) updateData.result = result;
      if (errorMessage) {
        updateData.errorMessage = errorMessage;
        updateData.attempts = { increment: 1 };
      }

      const task = await prisma.task.update({ where: { id }, data: updateData });
      res.json({ task });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update task' });
    }
  });

export default router;