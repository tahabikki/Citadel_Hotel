import { supabaseAdmin } from '@/lib/supabase-admin';

function getAdmin() {
  if (!supabaseAdmin) throw new Error('Supabase not configured');
  return supabaseAdmin;
}

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

function toReservation(record: any): Reservation {
  return {
    id: String(record.id),
    userId: record.userId || undefined,
    roomId: String(record.roomId),
    checkIn: new Date(record.checkIn).toISOString(),
    checkOut: new Date(record.checkOut).toISOString(),
    guests: Number(record.guests),
    adults: Number(record.adults || 0),
    children: Number(record.children || 0),
    guestName: record.guestName,
    guestEmail: record.guestEmail,
    guestPhone: record.guestPhone || '',
    specialRequests: record.specialRequests || '',
    status: record.status,
    totalPrice: record.totalPrice !== undefined ? Number(record.totalPrice) : undefined,
    paymentStatus: record.paymentStatus,
    createdAt: new Date(record.createdAt).toISOString(),
    updatedAt: new Date(record.updatedAt).toISOString(),
  };
}

function toReservationData(input: Partial<Reservation>) {
  return {
    userId: input.userId || undefined,
    roomId: input.roomId,
    checkIn: input.checkIn ? new Date(input.checkIn).toISOString() : undefined,
    checkOut: input.checkOut ? new Date(input.checkOut).toISOString() : undefined,
    guests: input.guests !== undefined ? Number(input.guests) : undefined,
    adults: input.adults !== undefined ? Number(input.adults) : undefined,
    children: input.children !== undefined ? Number(input.children) : undefined,
    guestName: input.guestName,
    guestEmail: input.guestEmail,
    guestPhone: input.guestPhone || '',
    specialRequests: input.specialRequests || '',
    status: input.status,
    totalPrice: input.totalPrice !== undefined ? Number(input.totalPrice) : undefined,
    paymentStatus: input.paymentStatus,
  };
}

function cleanUndefined(data: Record<string, unknown>) {
  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) delete data[key];
  });
  return data;
}

export const reservationService = {
  async getAll(): Promise<Reservation[]> {
    const { data, error } = await getAdmin()
      .from('Reservation')
      .select('*')
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return (data || []).map(toReservation);
  },

  async getById(id: string | number): Promise<Reservation | undefined> {
    const { data, error } = await getAdmin()
      .from('Reservation')
      .select('*')
      .eq('id', String(id))
      .maybeSingle();
    if (error) throw error;
    return data ? toReservation(data) : undefined;
  },

  async create(item: Omit<Reservation, 'id'>): Promise<Reservation> {
    const data = cleanUndefined(toReservationData(item));
    const { data: reservation, error } = await getAdmin()
      .from('Reservation')
      .insert({
        ...data,
        roomId: data.roomId,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guests: data.guests || 1,
        adults: data.adults || 1,
        children: data.children || 0,
        guestName: data.guestName || 'Guest',
        guestEmail: data.guestEmail || '',
        status: data.status || 'PENDING',
        paymentStatus: data.paymentStatus || 'PENDING',
        totalPrice: data.totalPrice || 0,
      })
      .select('*')
      .single();
    if (error) throw error;
    return toReservation(reservation);
  },

  async update(id: string | number, updates: Partial<Reservation>): Promise<Reservation> {
    const data = cleanUndefined(toReservationData(updates));
    const { data: reservation, error } = await getAdmin()
      .from('Reservation')
      .update(data)
      .eq('id', String(id))
      .select('*')
      .single();
    if (error) throw error;
    return toReservation(reservation);
  },

  async delete(id: string | number): Promise<boolean> {
    const { error } = await getAdmin().from('Reservation').delete().eq('id', String(id));
    if (error) throw error;
    return true;
  },

  async search(filter: Partial<Reservation>): Promise<Reservation[]> {
    let query = getAdmin().from('Reservation').select('*');
    Object.entries(filter).forEach(([key, value]) => {
      query = query.eq(key, value as any);
    });
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(toReservation);
  },
};
