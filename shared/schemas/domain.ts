import type { Reservation, Room } from '../types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isRoom(value: unknown): value is Room {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.id) &&
    isString(value.name) &&
    ['single', 'double', 'twin', 'family'].includes(value.type as string) &&
    isString(value.description) &&
    isNumber(value.price) &&
    isNumber(value.maxGuests) &&
    isString(value.beds) &&
    isStringArray(value.amenities) &&
    isStringArray(value.images) &&
    isBoolean(value.available)
  );
}

export function isReservation(value: unknown): value is Reservation {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.id) &&
    isString(value.roomId) &&
    isString(value.guestName) &&
    isString(value.guestEmail) &&
    isString(value.guestPhone) &&
    isString(value.checkIn) &&
    isString(value.checkOut) &&
    isNumber(value.guests) &&
    isNumber(value.totalPrice) &&
    ['pending', 'confirmed', 'active', 'completed', 'cancelled'].includes(value.status as string) &&
    ['pending', 'paid', 'refunded'].includes(value.paymentStatus as string) &&
    isString(value.createdAt)
  );
}

export function assertRoom(value: unknown): Room {
  if (!isRoom(value)) {
    throw new Error('Invalid room payload');
  }

  return value;
}

export function assertReservation(value: unknown): Reservation {
  if (!isReservation(value)) {
    throw new Error('Invalid reservation payload');
  }

  return value;
}
