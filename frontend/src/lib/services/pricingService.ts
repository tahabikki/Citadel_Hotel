import { createJsonDBService } from './jsonDbService';

export interface SeasonalRate {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  multiplier: number;
  roomType?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const pricingService = createJsonDBService<SeasonalRate>('pricing');