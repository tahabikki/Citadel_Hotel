import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { type, isActive } = req.query;
    const where: any = {};

    if (type) where.type = type.toString().toUpperCase();
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const media = await prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    res.json({ media });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { url, filename, type, category } = req.body;

    const media = await prisma.media.create({
      data: {
        url,
        filename,
        type: type?.toUpperCase() || 'HOTEL',
        category
      }
    });
    res.json({ media });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create media' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { url, filename, type, category, isActive } = req.body;

    const media = await prisma.media.update({
      where: { id: req.params.id as string },
      data: {
        ...(url && { url }),
        ...(filename !== undefined && { filename }),
        ...(type && { type: type.toUpperCase() }),
        ...(category !== undefined && { category }),
        ...(isActive !== undefined && { isActive })
      }
    });
    res.json({ media });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update media' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.media.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

export default router;