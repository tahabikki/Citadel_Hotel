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

export interface HotelInfo {
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  checkInTime: string;
  checkOutTime: string;
  rating: number;
  reviewCount: number;
  description: string;
  amenities: string[];
  images: string[];
  nearby: {
    name: string;
    distance: string;
    type: string;
  }[];
  restaurants: {
    name: string;
    distance: string;
    type: string;
  }[];
}

export const hotelInfo: HotelInfo = {
  name: "Citadel Hôtel",
  address: "28 rue Royale",
  city: "Calais",
  country: "France",
  phone: "+33 3 21 97 00 00",
  email: "contact@citadelhotel.fr",
  checkInTime: "16:00",
  checkOutTime: "11:30",
  rating: 4.6,
  reviewCount: 72,
  description: "Set next to the ferry terminal in Calais, this 2-star hotel is just 1312 feet from the train station. It offers free Wi-Fi access throughout and all the rooms have a LCD TV.",
  amenities: [
    "Free Wifi",
    "Family rooms",
    "Non-smoking rooms",
    "24-hour front desk",
    "Pet friendly",
    "Heating",
    "Smoke-free property",
    "Smoke alarms",
    "Security alarm"
  ],
  images: [
    "/images/hotel-front.jpg",
    "/images/bathroom.jpg",
    "/images/room-bed.jpg",
    "/images/kettle.jpg",
    "/images/street.jpg",
    "/images/beach.jpg",
    "/images/bedroom-green.jpg",
    "/images/bathroom-mirror.jpg"
  ],
  nearby: [
    { name: "Eglise Notre-Dame", distance: "250 m", type: "Church" },
    { name: "Citadelle", distance: "350 m", type: "Historic Site" },
    { name: "Statue des Six Bourgeois de Calais", distance: "650 m", type: "Monument" },
    { name: "Phare Du Port De Calais", distance: "700 m", type: "Lighthouse" },
    { name: "Second World War Museum", distance: "750 m", type: "Museum" },
    { name: "Calais Lighthouse", distance: "800 m", type: "Lighthouse" }
  ],
  restaurants: [
    { name: "Family Pub", distance: "50 m", type: "Restaurant" },
    { name: "Comte Restauration", distance: "50 m", type: "Restaurant" },
    { name: "Le Mazarin", distance: "50 m", type: "Cafe/Bar" }
  ]
};

export const rooms: Room[] = [
  {
    id: "family-room",
    name: "Family Room - 2 Adjacent Rooms",
    type: "family",
    description: "Spacious family room with 2 adjacent rooms, perfect for families. Features 2 twin beds and 1 queen bed.",
    price: 180,
    maxGuests: 4,
    beds: "2 twin beds and 1 queen bed",
    amenities: ["Free WiFi", "TV", "Private Bathroom", "Heating", "Safe"],
    images: ["/images/family-room.jpg"],
    available: true
  },
  {
    id: "twin-room",
    name: "Twin Room",
    type: "twin",
    description: "Comfortable room with 2 twin beds, ideal for business travelers or friends.",
    price: 89,
    maxGuests: 2,
    beds: "2 twin beds",
    amenities: ["Free WiFi", "TV", "Private Bathroom", "Heating"],
    images: ["/images/twin-room.jpg"],
    available: true
  },
  {
    id: "double-room",
    name: "Double Room",
    type: "double",
    description: "Cozy room with a full bed, perfect for couples. Features modern décor and all essential amenities.",
    price: 79,
    maxGuests: 2,
    beds: "1 full bed",
    amenities: ["Free WiFi", "TV", "Private Bathroom", "Heating", "Work Desk"],
    images: ["/images/double-room.jpg"],
    available: true
  }
];
