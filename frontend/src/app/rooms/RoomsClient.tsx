'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Star, Users } from 'lucide-react';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';

type Room = {
  id: string;
  name: string;
  type: string;
  price: number;
  maxGuests: number;
  amenities?: string[];
  imageUrl?: string | null;
  description?: string;
};

function fallbackRooms(): Room[] {
  return [
    {
      id: '1',
      name: 'Deluxe Suite',
      type: 'DELUXE',
      price: 250,
      maxGuests: 3,
      amenities: ['WiFi', 'Mini Bar', 'Room Service'],
      imageUrl: '/uploads/media/hotel/image_007.jpg',
      description: 'Spacious suite with city view and premium amenities.',
    },
  ];
}

function RoomSelection({ rooms, isLoading }: { rooms: Room[]; isLoading: boolean }) {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [filteredRooms, setFilteredRooms] = useState(rooms);

  useEffect(() => {
    setFilteredRooms(rooms);
  }, [rooms]);

  const handleSearch = () => {
    // Filter rooms based on guests
    const filtered = rooms.filter(room => room.maxGuests >= guests);
    setFilteredRooms(filtered);
  };

  return (
    <section className="py-12">
      <div className="container-custom">
        <ScrollReveal animation="fade-right">
          <div id="booking" className="mb-16 bg-[var(--card)] rounded-lg p-8 border border-[var(--border-light)]">
            <h2 className="font-display text-2xl mb-6">Book Your Stay</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-[var(--secondary)]">Check-in</label>
                <div className="flex items-center gap-2 border border-[var(--border-light)] rounded p-3">
                  <Calendar className="w-5 h-5 text-[var(--primary)]" />
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[var(--secondary)]">Check-out</label>
                <div className="flex items-center gap-2 border border-[var(--border-light)] rounded p-3">
                  <Calendar className="w-5 h-5 text-[var(--primary)]" />
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[var(--secondary)]">Guests</label>
                <div className="flex items-center gap-2 border border-[var(--border-light)] rounded p-3">
                  <Users className="w-5 h-5 text-[var(--primary)]" />
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="flex-1 bg-transparent outline-none text-sm"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n} className="bg-[var(--background)]">
                        {n} Guest{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-end">
                <button type="button" onClick={handleSearch} className="btn-primary w-full">
                  Search Rooms
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-left" delay={120}>
          <h2 className="font-display text-2xl mb-6">Select Your Room</h2>
        </ScrollReveal>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-[var(--secondary)]">Loading rooms...</p>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--secondary)]">No rooms available matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRooms.map((room, idx) => (
              <ScrollReveal
                key={room.id}
                delay={idx * 70}
                animation={idx % 2 === 0 ? 'fade-right' : 'fade-left'}
                className="h-full"
              >
                <div className="h-full bg-[var(--card)] rounded-lg border border-[var(--border-light)] overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={room.imageUrl || '/uploads/media/hotel/image_001.jpg'}
                      alt={room.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display text-lg">{room.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">4.6</span>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--secondary)] mb-4 line-clamp-2">{room.description}</p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {(room.amenities || []).slice(0, 3).map((amenity) => (
                        <span key={amenity} className="text-xs px-2 py-1 bg-[var(--card-hover)] rounded">
                          {amenity}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[var(--border-light)]">
                      <div>
                        <span className="text-xl font-bold">€{room.price}</span>
                        <span className="text-sm text-[var(--secondary)]"> / night</span>
                      </div>
                      <Link href="/#booking" className="btn-primary text-sm py-2">
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function RoomsClient() {
  const [rooms, setRooms] = useState<Room[]>(fallbackRooms());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch('/api/rooms?includeAll=true');
        const data = await res.json();
        const list = Array.isArray(data.rooms) ? data.rooms : [];
        if (list.length > 0) {
          setRooms(
            list.map((r: any) => ({
              id: String(r.id),
              name: r.name || r.type,
              type: r.type,
              price: Number(r.price),
              maxGuests: Number(r.maxGuests),
              amenities: r.amenities || [],
              imageUrl: r.imageUrl || null,
              description: r.description || '',
            }))
          );
        }
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="py-12 bg-[var(--card)] border-b border-[var(--border-light)]">
          <div className="container-custom">
            <ScrollReveal animation="fade-right">
              <h1 className="font-display text-3xl md:text-4xl mb-4">Our Rooms</h1>
            </ScrollReveal>
            <ScrollReveal animation="fade-left" delay={120}>
              <p className="text-[var(--secondary)]">Choose from our selection of elegant rooms and suites</p>
            </ScrollReveal>
          </div>
        </section>

        <RoomSelection rooms={rooms} isLoading={isLoading} />
      </main>
      <Footer />
    </>
  );
}

