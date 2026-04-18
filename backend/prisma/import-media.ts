import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function importImages() {
  const imagesPath = path.join(__dirname, '../../images.json');
  const imagesData = JSON.parse(fs.readFileSync(imagesPath, 'utf-8'));
  
  const images = imagesData.images || [];
  
  for (const img of images) {
    const url = img.url;
    const filename = img.filename || '';
    
    let type = 'HOTEL';
    if (url.includes('/max2048x1536/') || url.includes('/max500/') || url.includes('/max300/')) {
      if (url.includes('345498016') || url.includes('34358130') || url.includes('34358803') || 
          url.includes('107694380') || url.includes('271045634') || url.includes('345498264') ||
          url.includes('346560810')) {
        type = 'ROOM';
      } else if (url.includes('270201563') || url.includes('34358727')) {
        type = 'FACILITY';
      } else {
        type = 'HOTEL';
      }
    }
    
    const existing = await prisma.media.findFirst({
      where: { url }
    });
    
    if (!existing) {
      await prisma.media.create({
        data: {
          url,
          filename,
          type: type as any,
          category: null,
          isActive: true
        }
      });
      console.log(`Imported: ${filename || url.substring(0, 50)}`);
    }
  }
  
  const trvlImages = [
    "https://images.trvl-media.com/lodging/9000000/8980000/8978400/8978388/c9a24ad5.jpg?impolicy=resizecrop",
    "https://images.trvl-media.com/lodging/9000000/8980000/8978400/8978388/c25f0bf1.jpg?impolicy=resizecrop",
    "https://images.trvl-media.com/lodging/9000000/8980000/8978400/8978388/81d9baae.jpg?impolicy=resizecrop",
    "https://images.trvl-media.com/lodging/9000000/8980000/8978400/8978388/100449fd.jpg?impolicy=resizecrop",
    "https://images.trvl-media.com/lodging/9000000/8980000/8978400/8978388/d2e6867f.jpg?impolicy=resizecrop",
    "https://images.trvl-media.com/lodging/9000000/8980000/8978400/8978388/c20c0b15.jpg?impolicy=resizecrop",
    "https://images.trvl-media.com/lodging/9000000/8980000/8978400/8978388/1c13cab8.jpg?impolicy=resizecrop",
    "https://images.trvl-media.com/lodging/9000000/8980000/8978400/8978388/a0d1527f.jpg?impolicy=resizecrop",
    "https://images.trvl-media.com/lodging/9000000/8980000/8978400/8978388/f6661c26.jpg?impolicy=resizecrop",
    "https://images.trvl-media.com/lodging/9000000/8980000/8978400/8978388/218c7b6a.jpg?impolicy=resizecrop",
    "https://images.trvl-media.com/lodging/9000000/8980000/8978400/8978388/17b0d97e.jpg?impolicy=resizecrop",
    "https://images.trvl-media.com/lodging/9000000/8980000/8978400/8978388/b8c7d1b6.jpg?impolicy=resizecrop",
    "https://images.trvl-media.com/lodging/9000000/8980000/8978400/8978388/95b8814b.jpg?impolicy=resizecrop",
    "https://images.trvl-media.com/lodging/9000000/8980000/8978400/8978388/d8d3ca0c.jpg?impolicy=resizecrop",
    "https://images.trvl-media.com/lodging/9000000/8980000/8978400/8978388/0ace55f5.jpg?impolicy=resizecrop",
  ];
  
  for (const url of trvlImages) {
    const existing = await prisma.media.findFirst({
      where: { url }
    });
    
    if (!existing) {
      await prisma.media.create({
        data: {
          url,
          filename: null,
          type: 'HOTEL',
          isActive: true
        }
      });
      console.log(`Imported trvl image: ${url.substring(0, 50)}`);
    }
  }
  
  console.log('All images imported!');
}

importImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());