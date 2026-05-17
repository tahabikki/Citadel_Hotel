import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase-admin';

export interface Room {
  id: string;
  roomNumber?: string;
  name: string;
  type: string;
  price: number;
  maxGuests: number;
  description?: string;
  amenities?: string[];
  images?: string[];
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';
  createdAt: string;
  updatedAt: string;
}

const mockRooms: Room[] = [
  { id: '1', name: 'Deluxe Suite', type: 'SUITE', price: 250, maxGuests: 2, description: 'Luxury suite with sea view', status: 'AVAILABLE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', name: 'Standard Double', type: 'DOUBLE', price: 150, maxGuests: 2, description: 'Comfortable room', status: 'AVAILABLE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', name: 'Family Room', type: 'FAMILY', price: 200, maxGuests: 4, description: 'Spacious for families', status: 'AVAILABLE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const roomService = {
  async getAll(): Promise<Room[]> {
    if (!isSupabaseConfigured()) return mockRooms;
    const { data, error } = await supabaseAdmin!.from('Room').select('*');
    if (error) return mockRooms;
    return (data || []) as Room[];
  },

  async getById(id: string | number): Promise<Room | undefined> {
    if (!isSupabaseConfigured()) return mockRooms.find(r => r.id === String(id));
    const { data, error } = await supabaseAdmin!.from('Room').select('*').eq('id', String(id)).maybeSingle();
    if (error) return undefined;
    return data as Room | undefined;
  },

  async getAvailable(checkIn?: string, checkOut?: string, guests?: number): Promise<Room[]> {
    if (!isSupabaseConfigured()) return mockRooms;
    const { data, error } = await supabaseAdmin!.from('Room').select('*').eq('status', 'AVAILABLE');
    if (error) return mockRooms;
    return (data || []) as Room[];
  },

  async search(filter: Partial<Room>): Promise<Room[]> {
    if (!isSupabaseConfigured()) return mockRooms;
    let query = supabaseAdmin!.from('Room').select('*');
    Object.entries(filter).forEach(([key, value]) => {
      if (value) query = query.eq(key, value as any);
    });
    const { data, error } = await query;
    if (error) return mockRooms;
    return (data || []) as Room[];
  },

  async create(item: Partial<Room>): Promise<Room> {
    if (!isSupabaseConfigured()) return { ...item, id: 'mock-' + Date.now() } as Room;
    const { data, error } = await supabaseAdmin!.from('Room').insert(item).select().single();
    if (error) throw error;
    return data as Room;
  },

  async update(id: string, updates: Partial<Room>): Promise<Room> {
    if (!isSupabaseConfigured()) return { id, ...updates } as Room;
    const { data, error } = await supabaseAdmin!.from('Room').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as Room;
  },

  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return true;
    const { error } = await supabaseAdmin!.from('Room').delete().eq('id', id);
    return !error;
  }
};