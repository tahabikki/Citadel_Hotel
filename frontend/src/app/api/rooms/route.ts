import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');
    const roomType = searchParams.get('type');

    const where: any = { available: true };

    if (roomType) {
      where.type = roomType.toUpperCase();
    }

    if (guests) {
      where.maxGuests = { gte: parseInt(guests) };
    }

    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      const conflictingReservations = await prisma.reservation.findMany({
        where: {
          status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
          OR: [
            {
              checkIn: { lte: checkOutDate },
              checkOut: { gte: checkInDate }
            }
          ]
        },
        select: { roomId: true }
      });

      const occupiedRoomIds = conflictingReservations.map(r => r.roomId);
      where.id = { notIn: occupiedRoomIds };
    }

    const rooms = await prisma.room.findMany({
      where,
      orderBy: { price: 'asc' }
    });

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error('Get rooms error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Please login to make a reservation' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      roomId,
      checkIn,
      checkOut,
      guests,
      adults,
      children,
      specialRequests
    } = body;

    if (!roomId || !checkIn || !checkOut || !guests) {
      return NextResponse.json(
        { error: 'Missing required booking details' },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return NextResponse.json(
        { error: 'Check-out must be after check-in' },
        { status: 400 }
      );
    }

    if (checkInDate < new Date()) {
      return NextResponse.json(
        { error: 'Check-in date cannot be in the past' },
        { status: 400 }
      );
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId }
    });

    if (!room || !room.available) {
      return NextResponse.json(
        { error: 'Room not available' },
        { status: 400 }
      );
    }

    if (guests > room.maxGuests) {
      return NextResponse.json(
        { error: `Maximum ${room.maxGuests} guests allowed` },
        { status: 400 }
      );
    }

    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = Number(room.price) * nights;

    const conflictingReservations = await prisma.reservation.findMany({
      where: {
        roomId,
        status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
        OR: [
          {
            checkIn: { lte: checkOutDate },
            checkOut: { gte: checkInDate }
          }
        ]
      }
    });

    if (conflictingReservations.length > 0) {
      return NextResponse.json(
        { error: 'Room is not available for selected dates' },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        userId: session.userId,
        roomId,
        guestName: `${session.firstName || 'Guest'} ${session.lastName || ''}`.trim(),
        guestEmail: session.email,
        guestPhone: '',
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        adults: adults || 2,
        children: children || 0,
        totalPrice,
        specialRequests,
        status: 'PENDING',
        paymentStatus: 'PENDING'
      }
    });

    await prisma.log.create({
      data: {
        userId: session.userId,
        reservationId: reservation.id,
        action: 'RESERVATION_CREATED',
        details: { reservationId: reservation.id, roomId, totalPrice }
      }
    });

    return NextResponse.json({
      reservation: {
        id: reservation.id,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        totalPrice: reservation.totalPrice,
        status: reservation.status
      }
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    return NextResponse.json(
      { error: 'Failed to create reservation' },
      { status: 500 }
    );
  }
}