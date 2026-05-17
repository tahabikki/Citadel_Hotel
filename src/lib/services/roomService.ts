import { supabaseAdmin } from '@/lib/supabase-admin';

function getAdmin() {
  if (!supabaseAdmin) throw new Error('Supabase not configured');
  return supabaseAdmin;
}

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

function toRoom(record: any): Room {
  return {
    id: String(record.id),
    roomNumber: record.roomNumber,
    name: record.name,
    type: record.type,
    price: Number(record.price),
    maxGuests: Number(record.maxGuests),
    description: record.description || '',
    amenities: record.amenities || [],
    images: record.images || [],
    status: record.status || (record.available ? 'AVAILABLE' : 'MAINTENANCE'),
    createdAt: new Date(record.createdAt).toISOString(),
    updatedAt: new Date(record.updatedAt).toISOString(),
  };
}

function toRoomData(input: Partial<Room>) {
  const status = input.status || 'AVAILABLE';

  return {
    roomNumber: input.roomNumber,
    name: input.name,
    type: input.type ? String(input.type).toUpperCase() : undefined,
    price: input.price !== undefined ? Number(input.price) : undefined,
    maxGuests: input.maxGuests !== undefined ? Number(input.maxGuests) : undefined,
    description: input.description,
    amenities: input.amenities || undefined,
    images: input.images || undefined,
    status,
    available: status === 'AVAILABLE',
    beds: (input as any).beds || '1 bed',
  };
}

function cleanUndefined(data: Record<string, unknown>) {
  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) delete data[key];
  });
  return data;
}

export const roomService = {
  async getAll(): Promise<Room[]> {
    const { data, error } = await supabaseAdmin
      .from('Room')
      .select('*')
      .order('roomNumber', { ascending: true });
    if (error) throw error;
    return (data || []).map(toRoom);
  },

  async getById(id: string | number): Promise<Room | undefined> {
    const { data, error } = await supabaseAdmin
      .from('Room')
      .select('*')
      .eq('id', String(id))
      .maybeSingle();
    if (error) throw error;
    return data ? toRoom(data) : undefined;
  },

  async create(item: Omit<Room, 'id'>): Promise<Room> {
    const data = cleanUndefined(toRoomData(item));
    const { data: room, error } = await supabaseAdmin
      .from('Room')
      .insert({
        ...data,
        roomNumber: data.roomNumber || `ROOM-${Date.now()}`,
        name: data.name || 'New Room',
        type: data.type || 'DOUBLE',
        price: data.price || 0,
        maxGuests: data.maxGuests || 2,
        description: data.description || '',
        amenities: data.amenities || [],
        images: data.images || [],
        status: data.status || 'AVAILABLE',
        available: data.available,
        beds: data.beds || '1 bed',
      })
      .select('*')
      .single();
    if (error) throw error;
    return toRoom(room);
  },

  async update(id: string | number, updates: Partial<Room>): Promise<Room> {
    const data = cleanUndefined(toRoomData(updates));
    const { data: room, error } = await supabaseAdmin
      .from('Room')
      .update(data)
      .eq('id', String(id))
      .select('*')
      .single();
    if (error) throw error;
    return toRoom(room);
  },

  async delete(id: string | number): Promise<boolean> {
    const { error } = await getAdmin().from('Room').delete().eq('id', String(id));
    if (error) throw error;
    return true;
  },

  async search(filter: Partial<Room>): Promise<Room[]> {
    let query = getAdmin().from('Room').select('*');
    Object.entries(filter).forEach(([key, value]) => {
      query = query.eq(key, value as any);
    });
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(toRoom);
  },
};
