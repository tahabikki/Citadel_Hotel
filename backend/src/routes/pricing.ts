import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const rates = await prisma.seasonalRate.findMany({
      where: { isActive: true },
      orderBy: { startDate: 'asc' }
    });
    res.json({ rates });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch seasonal rates' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, seasonType, startDate, endDate, multiplier } = req.body;

    const rate = await prisma.seasonalRate.create({
      data: {
        name,
        seasonType: seasonType.toUpperCase(),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        multiplier
      }
    });
    res.json({ rate });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create seasonal rate' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, seasonType, startDate, endDate, multiplier, isActive } = req.body;

    const rate = await prisma.seasonalRate.update({
      where: { id: req.params.id as string },
      data: {
        ...(name && { name }),
        ...(seasonType && { seasonType: seasonType.toUpperCase() }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(multiplier !== undefined && { multiplier }),
        ...(isActive !== undefined && { isActive })
      }
    });
    res.json({ rate });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update seasonal rate' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.seasonalRate.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete seasonal rate' });
  }
});

export default router;