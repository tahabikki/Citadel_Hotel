import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import type { UserRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireRole([UserRole.ADMIN, UserRole.STAFF]);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');

    const where: any = {};

    if (status) {
      where.status = status.toUpperCase();
    }

    if (date) {
      const targetDate = new Date(date);
      where.checkIn = {
        lte: targetDate
      };
      where.checkOut = {
        gte: targetDate
      };
    }

    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        },
        room: true,
        tasks: true
      },
      orderBy: { checkIn: 'asc' }
    });

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error('Get reservations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireRole([UserRole.ADMIN, UserRole.STAFF]);

    const body = await request.json();
    const { reservationId, action } = body;

    if (!reservationId || !action) {
      return NextResponse.json(
        { error: 'Missing reservationId or action' },
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

    if (action === 'check-in') {
      if (reservation.status !== 'CONFIRMED') {
        return NextResponse.json(
          { error: 'Only confirmed reservations can be checked in' },
          { status: 400 }
        );
      }

      const updated = await prisma.reservation.update({
        where: { id: reservationId },
        data: { status: 'ACTIVE' }
      });

      const validFrom = new Date();
      const validUntil = new Date(reservation.checkOut);

      const task = await prisma.task.create({
        data: {
          reservationId,
          userId: reservation.userId,
          type: 'CREATE_CARD',
          status: 'PENDING',
          roomNumber: reservation.room.roomNumber,
          accessLevel: 1,
          validFrom,
          validUntil
        }
      });

      await prisma.log.create({
        data: {
          userId: session.userId,
          reservationId,
          action: 'CHECK_IN',
          details: { taskId: task.id, roomNumber: reservation.room.roomNumber }
        }
      });

      return NextResponse.json({
        reservation: updated,
        task: { id: task.id, type: task.type }
      });
    }

    if (action === 'check-out') {
      if (reservation.status !== 'ACTIVE') {
        return NextResponse.json(
          { error: 'Only active reservations can be checked out' },
          { status: 400 }
        );
      }

      const updated = await prisma.reservation.update({
        where: { id: reservationId },
        data: { status: 'COMPLETED' }
      });

      await prisma.task.create({
        data: {
          reservationId,
          userId: reservation.userId,
          type: 'REVOKE_CARD',
          status: 'PENDING',
          roomNumber: reservation.room.roomNumber,
          accessLevel: 0,
          validFrom: new Date(),
          validUntil: new Date()
        }
      });

      await prisma.log.create({
        data: {
          userId: session.userId,
          reservationId,
          action: 'CHECK_OUT',
          details: {}
        }
      });

      return NextResponse.json({ reservation: updated });
    }

    if (action === 'cancel') {
      const updated = await prisma.reservation.update({
        where: { id: reservationId },
        data: {
          status: 'CANCELLED',
          paymentStatus: 'REFUNDED'
        }
      });

      await prisma.log.create({
        data: {
          userId: session.userId,
          reservationId,
          action: 'RESERVATION_CANCELLED',
          details: {}
        }
      });

      return NextResponse.json({ reservation: updated });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Update reservation error:', error);
    return NextResponse.json(
      { error: 'Failed to update reservation' },
      { status: 500 }
    );
  }
}