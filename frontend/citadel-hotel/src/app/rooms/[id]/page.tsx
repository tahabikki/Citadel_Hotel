import type { Metadata, PropsWithChildren } from "next";
import { useParams, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import { useState, useEffect } from "react";
import { rooms } from "@/lib/data";

export const metadata: Metadata = {
  title: "Room Details | Citadel Hôtel",
  description: "View detailed information about our luxurious rooms and suites.",
};

export default function RoomDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [nights, setNights] = useState<number>(1);

  useEffect(() => {
    const roomData = rooms.find(r => r.id === params.id);
    if (roomData) {
      setRoom(roomData);
    }
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-[var(--background)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
            <p className="mt-4 text-[var(--secondary)]">Loading room details...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!room) {
    return (
      <>
        <Navbar />
        <main className="min-h-[calc(100vh-200px)] bg-[var(--background)]">
          <div className="container-custom py-20 text-center">
            <h2 className="font-display text-3xl mb-6">Room Not Found</h2>
            <p className="text-[var(--secondary)]">The room you're looking for doesn't exist.</p>
            <a href="/rooms" className="btn-primary mt-6">Back to Rooms</a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-200px)]">
        {/* Room Hero */}
        <section className="relative h-[500px] bg-[var(--background)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/20 to-[var(--primary)]/40" />
          <Image
            src={room.image}
            alt={room.name}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-6">
            <h2 className="font-display text-4xl md:text-5xl mb-4">{room.name}</h2>
            <p className="text-lg text-[var(--secondary)] mb-8">{room.type} Room</p>
          </div>
        </section>

        {/* Room Details */}
        <section className="section-padding bg-[var(--background)]">
          <div className="container-custom">
            <div className="grid gap-10 md:grid-cols-2">
              {/* Room Images */}
              <div className="space-y-6">
                <div className="relative h-[400px] rounded-lg overflow-hidden">
                  <Image
                    src={room.image}
                    alt={`${room.name} - Main View`}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
                {/* Additional images would go here */}
                <div className="flex gap-4">
                  <div className="relative h-[200px] w-[200px] rounded-lg overflow-hidden">
                    <Image
                      src={room.image}
                      alt={`${room.name} - Detail 1`}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>
                  <div className="relative h-[200px] w-[200px] rounded-lg overflow-hidden">
                    <Image
                      src={room.image}
                      alt={`${room.name} - Detail 2`}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>
                </div>
              </div>

              {/* Room Info */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="font-display text-2xl">{room.beds}</h3>
                  <p className="text-[var(--secondary)]">{room.description}</p>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="font-display text-xl mb-4">Amenities</h3>
                  <div className="flex flex-wrap gap-3">
                    {room.amenities.map((amenity: string, index: number) => (
                      <span key={index} className="text-xs px-3 py-1 bg-[var(--card-hover)] rounded-full text-[var(--secondary)]">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing & Booking */}
                <div className="space-y-6">
                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[var(--secondary)]">Price per night</span>
                      <span className="font-display text-2xl">€{room.price}</span>
                    </div>
                    
                    {/* Booking Form */}
                    <form className="space-y-4">
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <label className="block text-sm text-[var(--secondary)] mb-2">Check-in</label>
                          <input
                            type="date"
                            className="w-full px-4 py-3 border border-[var(--border)] rounded-md focus:border-[var(--primary)]"
                            onChange={(e) => {
                              const date = new Date(e.target.value);
                              setSelectedDate(date.toISOString().split('T')[0]);
                              // Calculate nights if check-out exists
                              if (selectedDate) {
                                const checkIn = new Date(selectedDate);
                                const checkOut = new Date(e.target.value);
                                const diffTime = Math.abs(checkOut - checkIn);
                                setNights(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
                              }
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[var(--secondary)] mb-2">Check-out</label>
                          <input
                            type="date"
                            className="w-full px-4 py-3 border border-[var(--border)] rounded-md focus:border-[var(--primary)]"
                            onChange={(e) => {
                              if (selectedDate) {
                                const checkIn = new Date(selectedDate);
                                const checkOut = new Date(e.target.value);
                                const diffTime = Math.abs(checkOut - checkIn);
                                setNights(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
                              }
                            }}
                          />
                        </div>
                        <div className="md:col-span-2">
                          {selectedDate && nights > 0 && (
                            <div className="flex items-center gap-4 p-3 bg-[var(--card-hover)] rounded-lg">
                              <span className="text-[var(--secondary)]">Total for {nights} night{(nights > 1 && 's')}: </span>
                              <span className="font-display text-xl">€{(room.price * nights).toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button 
                        type="submit" 
                        className="btn-primary w-full"
                        disabled={!selectedDate || nights === 0}
                      >
                        {selectedDate && nights > 0 ? `Book Stay (€${(room.price * nights).toFixed(2)})` : 'Select Dates'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Room Description */}
        <section className="section-padding bg-[var(--card)]">
          <div className="container-custom">
            <div className="space-y-6">
              <h2 className="font-display text-3xl mb-6">About This Room</h2>
              <p className="text-lg text-[var(--secondary)] leading-relaxed">
                Experience the perfect blend of comfort and elegance in our {room.name.toLowerCase()}. 
                Thoughtfully designed with {room.beds.toLowerCase()}, this room offers a tranquil retreat 
                after a day of exploring Calais or conducting business. Each detail has been carefully 
                considered to ensure your stay is nothing short of exceptional.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}