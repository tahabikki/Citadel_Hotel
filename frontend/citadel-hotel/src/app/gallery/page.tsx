import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Gallery | Citadel Hôtel",
  description: "Explore the elegant spaces and luxurious details of Citadel Hôtel through our gallery.",
};

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-200px)]">
        {/* Gallery Hero */}
        <section className="relative h-[600px] bg-[var(--background)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/20 to-[var(--primary)]/40" />
          <Image
            src={images[0]}
            alt="Citadel Hôtel Gallery"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-6">
            <h2 className="font-display text-4xl md:text-5xl mb-4">Elegance in Detail</h2>
            <p className="text-lg text-[var(--secondary)] mb-8">
              A visual journey through the sophisticated spaces and exquisite details of Citadel Hôtel.
            </p>
            <button className="btn-primary">View All Photos</button>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="section-padding bg-[var(--background)]">
          <div className="container-custom">
            <div className="text-center mb-12">
              <p className="text-sm tracking-[0.2em] uppercase text-[var(--secondary)] mb-4">Gallery</p>
              <h2 className="font-display text-4xl md:text-5xl mb-6">Explore Our Luxury</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {images.slice(0, 16).map((img, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg">
                  <Image
                    src={img}
                    alt={`Gallery ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}