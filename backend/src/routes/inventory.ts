import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, lowStock } = req.query;
    const where: any = { isActive: true };

    if (category) where.category = category.toString().toUpperCase();

    const items = await prisma.inventoryItem.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    if (lowStock === 'true') {
      const filtered = items.filter((item: any) => item.quantity < item.minStock);
      return res.json({ items: filtered });
    }

    res.json({ items });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

router.get('/stats', async (req: Request, res: Response) => {
  try {
    const items = await prisma.inventoryItem.findMany({ where: { isActive: true } });
    const totalItems = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const lowStock = items.filter((item: any) => item.quantity < item.minStock).length;
    const minibarItems = items.filter((item: any) => item.category === 'MINIBAR').length;

    res.json({ totalItems, lowStock, minibarItems });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, category, quantity, minStock, unitPrice } = req.body;

    const item = await prisma.inventoryItem.create({
      data: {
        name,
        category: category.toUpperCase(),
        quantity: quantity || 0,
        minStock: minStock || 10,
        unitPrice
      }
    });
    res.json({ item });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create inventory item' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, category, quantity, minStock, unitPrice, isActive } = req.body;

    const item = await prisma.inventoryItem.update({
      where: { id: req.params.id as string },
      data: {
        ...(name && { name }),
        ...(category && { category: category.toUpperCase() }),
        ...(quantity !== undefined && { quantity }),
        ...(minStock !== undefined && { minStock }),
        ...(unitPrice !== undefined && { unitPrice }),
        ...(isActive !== undefined && { isActive })
      }
    });
    res.json({ item });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inventory item' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.inventoryItem.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete inventory item' });
  }
});

export default router;