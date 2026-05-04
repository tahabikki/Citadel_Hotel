import { createJsonDBService } from './jsonDbService';

export type Payment = {
  id: string;
  reservationId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED';
  provider?: 'STRIPE' | 'MANUAL';
  providerPaymentId?: string;
  createdAt: string;
  updatedAt: string;
};

export const paymentService = createJsonDBService<Payment>('payments');

