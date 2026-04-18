import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia'
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Please login to complete payment' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reservationId, paymentMethodId } = body;

    if (!reservationId) {
      return NextResponse.json(
        { error: 'Missing reservationId' },
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

    if (reservation.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    if (reservation.paymentStatus === 'PAID') {
      return NextResponse.json(
        { error: 'Payment already completed' },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(reservation.totalPrice) * 100),
      currency: 'eur',
      metadata: {
        reservationId: reservation.id,
        userId: session.userId
      }
    });

    const payment = await prisma.payment.create({
      data: {
        reservationId: reservation.id,
        amount: reservation.totalPrice,
        currency: 'EUR',
        stripePaymentId: paymentIntent.id,
        status: 'PENDING'
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id
    });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Payment failed' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentIntentId, status } = body;

    if (!paymentIntentId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findFirst({
      where: { stripePaymentId: paymentIntentId },
      include: { reservation: true }
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    const paymentStatus = status === 'succeeded' ? 'PAID' : 'FAILED';

    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: paymentStatus }
    });

    if (paymentStatus === 'PAID') {
      await prisma.reservation.update({
        where: { id: payment.reservationId },
        data: {
          paymentStatus: 'PAID',
          status: 'CONFIRMED'
        }
      });

      await prisma.log.create({
        data: {
          userId: payment.reservation.userId,
          reservationId: payment.reservationId,
          action: 'PAYMENT_COMPLETED',
          details: { amount: payment.amount, paymentId: payment.id }
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}