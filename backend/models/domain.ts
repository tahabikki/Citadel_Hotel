export type UserRole = 'GUEST' | 'ADMIN' | 'STAFF';
export type RoomType = 'SINGLE' | 'DOUBLE' | 'TWIN' | 'FAMILY';
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';
export type TaskType = 'CREATE_CARD' | 'REVOKE_CARD' | 'UPDATE_CARD';
export type TaskStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type DecimalLike = number | string;
export type JsonValue = unknown;

export interface DbUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbRoom {
  id: string;
  name: string;
  type: RoomType;
  description: string;
  price: DecimalLike;
  maxGuests: number;
  beds: string;
  amenities: string[];
  floor?: number | null;
  roomNumber: string;
  images: string[];
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbReservation {
  id: string;
  userId: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  adults: number;
  children: number;
  totalPrice: DecimalLike;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbPayment {
  id: string;
  reservationId: string;
  amount: DecimalLike;
  currency: string;
  stripePaymentId?: string | null;
  stripeCustomerId?: string | null;
  status: PaymentStatus;
  method?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbTask {
  id: string;
  reservationId: string;
  userId: string;
  type: TaskType;
  status: TaskStatus;
  roomNumber: string;
  accessLevel: number;
  validFrom: Date;
  validUntil: Date;
  cardData?: JsonValue | null;
  result?: JsonValue | null;
  errorMessage?: string | null;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date | null;
}

export interface DbLog {
  id: string;
  userId?: string | null;
  reservationId?: string | null;
  action: string;
  details?: JsonValue | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
}

export interface DbHotelSettings {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  checkInTime: string;
  checkOutTime: string;
  currency: string;
  timezone: string;
  stripePublicKey?: string | null;
  stripeSecretKey?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
