import { createJsonDBService } from './jsonDbService';

export interface Room {
  id: string;
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

export const roomService = createJsonDBService<Room>('rooms');