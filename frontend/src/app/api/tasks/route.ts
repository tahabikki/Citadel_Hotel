import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import type { UserRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireRole([UserRole.ADMIN, UserRole.STAFF]);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};

    if (status) {
      where.status = status.toUpperCase();
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        reservation: {
          include: {
            room: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireRole([UserRole.ADMIN]);

    const body = await request.json();
    const { taskId, status, result, errorMessage } = body;

    if (!taskId) {
      return NextResponse.json(
        { error: 'Missing taskId' },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (status) {
      updateData.status = status.toUpperCase();
      
      if (status === 'COMPLETED') {
        updateData.completedAt = new Date();
      }
    }

    if (result) {
      updateData.result = result;
    }

    if (errorMessage) {
      updateData.errorMessage = errorMessage;
      updateData.attempts = { increment: 1 };
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        reservation: true
      }
    });

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reservationId, type, accessLevel } = body;

    if (!reservationId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { room: true }
    });

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    const validFrom = type === 'CREATE_CARD' ? new Date() : new Date();
    const validUntil = type === 'CREATE_CARD' 
      ? reservation.checkOut 
      : new Date();

    const task = await prisma.task.create({
      data: {
        reservationId,
        userId: reservation.userId,
        type: type.toUpperCase(),
        status: 'PENDING',
        roomNumber: reservation.room.roomNumber,
        accessLevel: accessLevel || 1,
        validFrom,
        validUntil
      }
    });

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

async function getSession() {
  const { getSession } = await import('@/lib/auth');
  return getSession();
}