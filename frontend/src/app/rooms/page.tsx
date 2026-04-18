import { Metadata } from "next";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Star, Wifi, Coffee, Users, Calendar, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Rooms | Citadel Hôtel",
  description: "View all available rooms at Citadel Hôtel in Calais. Book your perfect stay.",
};

const rooms = [
  {
    id: '101',
    name: 'Single Room',
    type: 'Single',
    price: 59,
    maxGuests: 1,
    beds: '1 single bed',
    amenities: ['Free WiFi', 'TV', 'Private Bathroom', 'Heating'],
    image: "/uploads/media/hotel/image_001.jpg",
    description: 'Comfortable single room perfect for solo travelers.'
  },
  {
    id: '102',
    name: 'Double Room',
    type: 'Double',
    price: 79,
    maxGuests: 2,
    beds: '1 full bed',
    amenities: ['Free WiFi', 'TV', 'Private Bathroom', 'Heating', 'Work Desk'],
    image: "/uploads/media/hotel/image_005.jpg",
    description: 'Cozy room with a full bed, perfect for couples.'
  },
  {
    id: '103',
    name: 'Twin Room',
    type: 'Twin',
    price: 89,
    maxGuests: 2,
    beds: '2 twin beds',
    amenities: ['Free WiFi', 'TV', 'Private Bathroom', 'Heating'],
    image: "/uploads/media/hotel/image_006.jpg",
    description: 'Comfortable room with 2 twin beds, ideal for business travelers.'
  },
  {
    id: '104',
    name: 'Family Room',
    type: 'Family',
    price: 150,
    maxGuests: 4,
    beds: '2 twin beds + 1 queen bed',
    amenities: ['Free WiFi', 'TV', 'Private Bathroom', 'Heating', 'Safe'],
    image: "/uploads/media/hotel/image_007.jpg",
    description: 'Spacious family room with 2 adjacent rooms, perfect for families.'
  },
  {
    id: '105',
    name: 'Deluxe Suite',
    type: 'Suite',
    price: 200,
    maxGuests: 3,
    beds: '1 king bed + sofa bed',
    amenities: ['Free WiFi', 'TV', 'Private Bathroom', 'Heating', 'Mini Bar', 'Balcony'],
    image: "/uploads/media/hotel/image_008.jpg",
    description: 'Luxurious suite with separate living area and premium amenities.'
  }
];

export default function RoomsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="py-12 bg-[var(--card)] border-b border-[var(--border-light)]">
          <div className="container-custom">
            <h1 className="font-display text-3xl md:text-4xl mb-4">Our Rooms</h1>
            <p className="text-[var(--secondary)]">Choose from our selection of elegant rooms and suites</p>
          </div>
        </section>

        <RoomSelection />
      </main>
      <Footer />
    </>
  );
}

function RoomSelection() {
  return (
    <section className="py-12">
      <div className="container-custom">
        <div id="booking" className="mb-16 bg-[var(--card)] rounded-lg p-8 border border-[var(--border-light)]">
          <h2 className="font-display text-2xl mb-6">Book Your Stay</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-[var(--secondary)]">Check-in</label>
              <div className="flex items-center gap-2 border border-[var(--border-light)] rounded p-3">
                <Calendar className="w-5 h-5 text-[var(--primary)]" />
                <span>Select date</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[var(--secondary)]">Check-out</label>
              <div className="flex items-center gap-2 border border-[var(--border-light)] rounded p-3">
                <Calendar className="w-5 h-5 text-[var(--primary)]" />
                <span>Select date</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[var(--secondary)]">Guests</label>
              <div className="flex items-center gap-2 border border-[var(--border-light)] rounded p-3">
                <Users className="w-5 h-5 text-[var(--primary)]" />
                <span>2 Adults</span>
              </div>
            </div>
            <div className="flex items-end">
              <button className="btn-primary w-full">Search Rooms</button>
            </div>
          </div>
        </div>

        <h2 className="font-display text-2xl mb-6">Select Your Room</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="bg-[var(--card)] rounded-lg border border-[var(--border-light)] overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover"
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
                <p className="text-sm text-[var(--secondary)] mb-3">{room.beds}</p>
                <p className="text-sm text-[var(--foreground)]/70 mb-4 line-clamp-2">{room.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {room.amenities.slice(0, 3).map((amenity) => (
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
          ))}
        </div>
      </div>
    </section>
  );
}