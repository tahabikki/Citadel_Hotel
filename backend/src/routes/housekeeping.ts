import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, priority, assignedToId } = req.query;
    const where: any = {};

    if (status) where.status = status.toString().toUpperCase();
    if (priority) where.priority = priority.toString().toUpperCase();
    if (assignedToId) where.assignedToId = assignedToId.toString();

    const tasks = await prisma.housekeepingTask.findMany({
      where,
      include: { room: true, assignedTo: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch housekeeping tasks' });
  }
});

router.get('/stats', async (req: Request, res: Response) => {
  try {
    const [pending, inProgress, completed, maintenance] = await Promise.all([
      prisma.housekeepingTask.count({ where: { status: 'PENDING' } }),
      prisma.housekeepingTask.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.housekeepingTask.count({ where: { status: 'COMPLETED' } }),
      prisma.housekeepingTask.count({ where: { status: 'MAINTENANCE_NEEDED' } })
    ]);
    res.json({ pending, inProgress, completed, maintenance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { roomId, priority, assignedToId, notes } = req.body;

    const task = await prisma.housekeepingTask.create({
      data: {
        roomId,
        priority: priority?.toUpperCase() || 'NORMAL',
        assignedToId,
        notes
      }
    });
    res.json({ task });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create housekeeping task' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { status, priority, assignedToId, notes } = req.body;

    const task = await prisma.housekeepingTask.update({
      where: { id: req.params.id as string },
      data: {
        ...(status && { status: status.toUpperCase() }),
        ...(priority && { priority: priority.toUpperCase() }),
        ...(assignedToId !== undefined && { assignedToId }),
        ...(notes !== undefined && { notes }),
        ...(status === 'COMPLETED' && { completedAt: new Date() })
      }
    });
    res.json({ task });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update housekeeping task' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.housekeepingTask.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete housekeeping task' });
  }
});

export default router;