import { createJsonDBService } from './jsonDbService';

export interface Reservation {
  id: string;
  userId?: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  adults: number;
  children: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  specialRequests?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
  totalPrice?: number;
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  createdAt: string;
  updatedAt: string;
}

export const reservationService = createJsonDBService<Reservation>('reservations');
