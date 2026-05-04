export interface Room {
  id: string;
  name: string;
  type: 'single' | 'double' | 'twin' | 'family';
  description: string;
  price: number;
  maxGuests: number;
  beds: string;
  amenities: string[];
  images: string[];
  available: boolean;
}

export interface Reservation {
  id: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
}
