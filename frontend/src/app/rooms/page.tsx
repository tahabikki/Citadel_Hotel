import type { Metadata } from 'next';
import RoomsClient from './RoomsClient';

export const metadata: Metadata = {
  title: 'Rooms | Citadel Hôtel',
  description: 'View all available rooms at Citadel Hôtel in Calais. Book your perfect stay.',
};

export default function RoomsPage() {
  return <RoomsClient />;
}

