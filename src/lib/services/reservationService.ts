import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase-admin';

export interface Reservation {
  id: string;
  userId?: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  adults: number;
  children: number;
  status: string;
  paymentStatus?: string;
  specialRequests?: string;
  totalPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export const reservationService = {
  async getAll(): Promise<Reservation[]> {
    return [];
  },

  async getById(id: string | number): Promise<Reservation | undefined> {
    return undefined;
  },

  async create(item: Partial<Reservation>): Promise<Reservation> {
    if (!isSupabaseConfigured()) {
      return { id: 'mock-' + Date.now(), ...item } as Reservation;
    }
    const { data, error } = await supabaseAdmin!.from('Reservation').insert(item).select().single();
    if (error) throw error;
    return data as Reservation;
  },

  async update(id: string, updates: Partial<Reservation>): Promise<Reservation> {
    return { id, ...updates } as Reservation;
  },

  async delete(id: string): Promise<boolean> {
    return true;
  }
};