import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const staffFile = path.join(__dirname, '../../data/staff.json');
    let staff = [];
    if (fs.existsSync(staffFile)) {
      const data = fs.readFileSync(staffFile, 'utf8');
      staff = JSON.parse(data);
    }

    const { status, department, role } = req.query;
    let filtered = staff;

    if (status) filtered = filtered.filter((s: any) => s.status === status.toString().toUpperCase());
    if (department) filtered = filtered.filter((s: any) => s.department === department.toString());
    if (role) filtered = filtered.filter((s: any) => s.role === role.toString().toUpperCase());

    filtered.sort((a: any, b: any) => a.lastName.localeCompare(b.lastName));
    res.json({ staff: filtered });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const staffFile = path.join(__dirname, '../../data/staff.json');
    let staff = [];
    if (fs.existsSync(staffFile)) {
      const data = fs.readFileSync(staffFile, 'utf8');
      staff = JSON.parse(data);
    }

    const found = staff.find((s: any) => s.id === req.params.id as string);
    if (!found) return res.status(404).json({ error: 'Staff not found' });
    res.json({ staff: found });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, role, department, shiftStart, shiftEnd, notes } = req.body;

    const staffFile = path.join(__dirname, '../../data/staff.json');
    let staff = [];
    if (fs.existsSync(staffFile)) {
      const data = fs.readFileSync(staffFile, 'utf8');
      staff = JSON.parse(data);
    }

    const existing = staff.find((s: any) => s.email === email);
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const newStaff = {
      id: 'STAFF-' + Date.now(),
      firstName,
      lastName,
      email,
      phone,
      role: role.toUpperCase(),
      department,
      status: 'ACTIVE',
      shiftStart,
      shiftEnd,
      hireDate: new Date().toISOString(),
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    staff.push(newStaff);
    fs.writeFileSync(staffFile, JSON.stringify(staff, null, 2));

    res.json({ staff: newStaff });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create staff' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, phone, role, department, status, shiftStart, shiftEnd, notes } = req.body;

    const staffFile = path.join(__dirname, '../../data/staff.json');
    let staff = [];
    if (fs.existsSync(staffFile)) {
      const data = fs.readFileSync(staffFile, 'utf8');
      staff = JSON.parse(data);
    }

    const index = staff.findIndex((s: any) => s.id === req.params.id as string);
    if (index === -1) return res.status(404).json({ error: 'Staff not found' });

    const updated = {
      ...staff[index],
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(phone && { phone }),
      ...(role && { role: role.toUpperCase() }),
      ...(department && { department }),
      ...(status && { status: status.toUpperCase() }),
      ...(shiftStart !== undefined && { shiftStart }),
      ...(shiftEnd !== undefined && { shiftEnd }),
      ...(notes !== undefined && { notes }),
      updatedAt: new Date().toISOString()
    };

    staff[index] = updated;
    fs.writeFileSync(staffFile, JSON.stringify(staff, null, 2));

    res.json({ staff: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update staff' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const staffFile = path.join(__dirname, '../../data/staff.json');
    let staff = [];
    if (fs.existsSync(staffFile)) {
      const data = fs.readFileSync(staffFile, 'utf8');
      staff = JSON.parse(data);
    }

    const filtered = staff.filter((s: any) => s.id !== req.params.id as string);
    if (filtered.length === staff.length) return res.status(404).json({ error: 'Staff not found' });

    fs.writeFileSync(staffFile, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete staff' });
  }
});

export default router;