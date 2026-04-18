'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, Users, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { rooms, hotelInfo } from '../lib/data';
import { roomImages, images } from '../lib/images';
import Link from 'next/link';

interface SearchParams {
  location: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  rooms: number;
}

function formatDate(date: Date | null): string {
  if (!date) return 'Add date';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function BookingSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    location: 'Calais',
    checkIn: null,
    checkOut: null,
    guests: 2,
    rooms: 1
  });
  const [activeField, setActiveField] = useState<'checkIn' | 'checkOut' | 'guests' | null>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    console.log('Searching:', searchParams);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-[var(--card)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] overflow-hidden border border-[var(--border-light)]">
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[var(--border-light)]">
          <div 
            className="p-4 cursor-pointer hover:bg-[var(--card-hover)] transition-colors"
            onClick={() => setActiveField('checkIn')}
          >
            <label className="block text-xs text-[var(--secondary)] mb-1">CHECK-IN</label>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[var(--primary)]" />
              <span className="font-medium">
                {formatDate(searchParams.checkIn)}
              </span>
            </div>
          </div>

          <div 
            className="p-4 cursor-pointer hover:bg-[var(--card-hover)] transition-colors"
            onClick={() => setActiveField('checkOut')}
          >
            <label className="block text-xs text-[var(--secondary)] mb-1">CHECK-OUT</label>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[var(--primary)]" />
              <span className="font-medium">
                {formatDate(searchParams.checkOut)}
              </span>
            </div>
          </div>

          <div 
            className="p-4 cursor-pointer hover:bg-[var(--card-hover)] transition-colors"
            onClick={() => setActiveField('guests')}
          >
            <label className="block text-xs text-[var(--secondary)] mb-1">GUESTS</label>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--primary)]" />
              <span className="font-medium">
                {searchParams.guests} adults · 0 children · {searchParams.rooms} room
              </span>
            </div>
          </div>

          <div className="p-4 flex items-center">
            <button 
              onClick={handleSearch}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RoomCard({ room, onSelect }: { room: typeof rooms[0]; onSelect: (room: typeof rooms[0]) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const roomImage = roomImages[room.type as keyof typeof roomImages] || roomImages.double;

  return (
    <div className="bg-[var(--card)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] overflow-hidden border border-[var(--border-light)] hover:shadow-[var(--shadow-lg)] transition-shadow">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="relative h-48 md:h-auto">
          <Image
            src={roomImage}
            alt={room.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        
        <div className="p-6 md:col-span-2">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-display text-xl font-semibold">{room.name}</h3>
            <div className="flex items-center gap-1">
              <span className="text-lg font-semibold">{hotelInfo.rating}</span>
              <ChevronDown className="w-4 h-4 text-[var(--secondary)]" />
            </div>
          </div>
          
          <p className="text-[var(--secondary)] text-sm mb-3">{room.beds}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {room.amenities.slice(0, 4).map((amenity, i) => (
              <span 
                key={i}
                className="text-xs px-2 py-1 bg-[var(--card-hover)] rounded-full text-[var(--secondary)]"
              >
                {amenity}
              </span>
            ))}
          </div>
          
          <p className="text-sm text-[var(--secondary)] mb-4 line-clamp-2">{room.description}</p>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold">€{room.price}</span>
              <span className="text-sm text-[var(--secondary)]"> / night</span>
            </div>
            <button 
              onClick={() => onSelect(room)}
              className="btn-primary"
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Building2Icon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
      <path d="M4 14h2" />
    </svg>
  );
}

export function RoomList() {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-semibold mb-6">Available Rooms</h2>
      {rooms.map((room, index) => (
        <div 
          key={room.id}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <RoomCard room={room} onSelect={(r) => console.log('Selected:', r)} />
        </div>
      ))}
    </div>
  );
}

export function HotelGallery() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-[var(--radius-lg)] overflow-hidden">
      {images.slice(0, 8).map((img, i) => (
        <div 
          key={i} 
          className={`relative aspect-square ${i === 0 ? 'md:row-span-2 md:col-span-2 md:aspect-auto' : ''}`}
        >
          <Image
            src={img}
            alt={`Hotel image ${i + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
      ))}
    </div>
  );
}

export function Reviews() {
  const categories = [
    { name: 'Staff', rating: 6.8 },
    { name: 'Facilities', rating: 4.8 },
    { name: 'Cleanliness', rating: 5.3 },
    { name: 'Comfort', rating: 5.9 },
    { name: 'Value for money', rating: 5.0 },
    { name: 'Location', rating: 7.6 },
  ];

  return (
    <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-[var(--primary)] text-white rounded-[var(--radius-md)] px-4 py-2">
          <span className="text-2xl font-bold">{hotelInfo.rating}</span>
        </div>
        <div>
          <h3 className="font-semibold">Scored {hotelInfo.rating}</h3>
          <p className="text-sm text-[var(--secondary)]">{hotelInfo.reviewCount} reviews</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.name} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{cat.name}</span>
              <span className="font-medium">{cat.rating}</span>
            </div>
            <div className="h-2 bg-[var(--card-hover)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--primary)] rounded-full"
                style={{ width: `${(cat.rating / 10) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
