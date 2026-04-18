import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const roomImages = [
  "https://cf.bstatic.com/xdata/images/hotel/max2048x1536/345498016.jpg?k=2fa982dd94cf38d61a3b884852d71b5a856e676b571401d4301eb5160a77a714",
  "https://cf.bstatic.com/xdata/images/hotel/max2048x1536/34358130.jpg?k=1a391430151a873a07fdab1cfde15d4d0c427bdbe784d631a6276e2efee6676b",
  "https://cf.bstatic.com/xdata/images/hotel/max2048x1536/34358803.jpg?k=067c3c69b3aab6a0937560b0c4a3f830d42b1667e140593b1f9300d3faf1ed5f",
  "https://cf.bstatic.com/xdata/images/hotel/max2048x1536/107694380.jpg?k=ac1beb781452bb71a522828c8e742eb1a6c5dc17c82a60e48138c37579aad60f",
  "https://cf.bstatic.com/xdata/images/hotel/max2048x1536/271045634.jpg?k=7b138c8971c10f277bdfa6af8b6b9faafebd96e2531399fa685d8c8bebfbc5ff",
  "https://cf.bstatic.com/xdata/images/hotel/max2048x1536/345498264.jpg?k=82b3edd89af5b38284e0d96732575dcf6eb2a546814bb50e01fc64e4f9e46cf9",
  "https://cf.bstatic.com/xdata/images/hotel/max2048x1536/346560810.jpg?k=c581431056d6984a251de82e3feffe07555573302f23269d964a6610d3165e60",
];

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@citadel.com' },
    update: {},
    create: {
      email: 'admin@citadel.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  await prisma.hotelSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Citadel Hôtel',
      address: '42 Rue de la Victoire',
      city: 'Calais',
      country: 'France',
      phone: '+33 3 21 96 00 00',
      email: 'contact@citadel-hotel.com',
    },
  });

  const rooms = [
    { name: 'Single Room', type: 'SINGLE', description: 'Comfortable single room with private bathroom', price: 59, maxGuests: 1, beds: '1 Single', amenities: ['TV', 'WiFi', 'Safe'], floor: 1, roomNumber: '101' },
    { name: 'Double Room', type: 'DOUBLE', description: 'Spacious double room with city views', price: 79, maxGuests: 2, beds: '1 Double', amenities: ['TV', 'WiFi', 'Safe', 'Mini-bar'], floor: 1, roomNumber: '102' },
    { name: 'Twin Room', type: 'TWIN', description: 'Room with two twin beds', price: 89, maxGuests: 2, beds: '2 Singles', amenities: ['TV', 'WiFi', 'Safe'], floor: 2, roomNumber: '103' },
    { name: 'Family Room', type: 'FAMILY', description: 'Large family room with extra space', price: 150, maxGuests: 4, beds: '1 Double + 2 Singles', amenities: ['TV', 'WiFi', 'Safe', 'Mini-bar', 'Bathtub'], floor: 2, roomNumber: '104' },
    { name: 'Deluxe Suite', type: 'SUITE', description: 'Luxurious suite with separate living area', price: 200, maxGuests: 2, beds: '1 King', amenities: ['TV', 'WiFi', 'Safe', 'Mini-bar', 'Bathtub', 'Balcony'], floor: 3, roomNumber: '105' },
    { name: 'Double Room', type: 'DOUBLE', description: 'Garden view double room', price: 89, maxGuests: 2, beds: '1 Double', amenities: ['TV', 'WiFi', 'Safe', 'Garden View'], floor: 1, roomNumber: '106' },
    { name: 'Twin Room', type: 'TWIN', description: 'Twin room with workspace', price: 79, maxGuests: 2, beds: '2 Singles', amenities: ['TV', 'WiFi', 'Safe', 'Desk'], floor: 2, roomNumber: '107' },
  ];

  for (let i = 0; i < rooms.length; i++) {
    await prisma.room.upsert({
      where: { roomNumber: rooms[i].roomNumber },
      update: { imageUrl: roomImages[i] },
      create: {
        ...rooms[i],
        imageUrl: roomImages[i],
      },
    });
  }

  console.log('Database seeded with rooms and images!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());