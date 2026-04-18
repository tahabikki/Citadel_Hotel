import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, department, role } = req.query;
    const where: any = {};

    if (status) where.status = status.toString().toUpperCase();
    if (department) where.department = department.toString();
    if (role) where.role = role.toString().toUpperCase();

    const staff = await prisma.staff.findMany({
      where,
      orderBy: { lastName: 'asc' }
    });
    res.json({ staff });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const staff = await prisma.staff.findUnique({
      where: { id: req.params.id }
    });
    if (!staff) return res.status(404).json({ error: 'Staff not found' });
    res.json({ staff });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, role, department, shiftStart, shiftEnd, notes } = req.body;

    const existing = await prisma.staff.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const staff = await prisma.staff.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        role: role.toUpperCase(),
        department,
        shiftStart,
        shiftEnd,
        notes
      }
    });
    res.json({ staff });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create staff' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, phone, role, department, status, shiftStart, shiftEnd, notes } = req.body;

    const staff = await prisma.staff.update({
      where: { id: req.params.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone && { phone }),
        ...(role && { role: role.toUpperCase() }),
        ...(department && { department }),
        ...(status && { status: status.toUpperCase() }),
        ...(shiftStart !== undefined && { shiftStart }),
        ...(shiftEnd !== undefined && { shiftEnd }),
        ...(notes !== undefined && { notes })
      }
    });
    res.json({ staff });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update staff' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.staff.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete staff' });
  }
});

export default router;