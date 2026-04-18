import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Dining | Citadel Hôtel",
  description: "Experience exquisite dining at Citadel Hôtel. Our restaurants offer a culinary journey through local and international flavors.",
};

export default function DiningPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-200px)]">
        {/* Dining Hero */}
        <section className="relative h-[600px] bg-[var(--background)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/20 to-[var(--primary)]/40" />
          <Image
            src={images[30]} // Assuming this is a dining image
            alt="Citadel Hôtel Restaurant"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-6">
            <h2 className="font-display text-4xl md:text-5xl mb-4">Exquisite Dining</h2>
            <p className="text-lg text-[var(--secondary)] mb-8">
              Indulge in a culinary journey at Citadel Hôtel, where our restaurants blend local flavors with international techniques.
            </p>
            <div className="flex gap-4">
              <button className="btn-primary">Explore Restaurants</button>
              <button className="btn-outline">Make a Reservation</button>
            </div>
          </div>
        </section>

        {/* Restaurant Section */}
        <section className="section-padding bg-[var(--background)]">
          <div className="container-custom">
            <div className="text-center mb-12">
              <p className="text-sm tracking-[0.2em] uppercase text-[var(--secondary)] mb-4">Our Restaurants</p>
              <h2 className="font-display text-4xl md:text-5xl mb-6">Where Flavor Meets Elegance</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Restaurant 1 */}
              <div className="bg-[var(--card)] rounded-lg overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow">
                <Image
                  src={images[31]}
                  alt="Fine Dining Restaurant"
                  className="h-[300px] w-full object-cover"
                  sizes="100vw"
                />
                <div className="p-6">
                  <h3 className="font-display text-2xl mb-3">Le Royale</h3>
                  <p className="text-[var(--secondary)] mb-4">
                    Our signature fine dining restaurant offering a menu crafted from locally sourced ingredients.
                  </p>
                  <a href="#" className="btn-outline">View Menu</a>
                </div>
              </div>
              {/* Restaurant 2 */}
              <div className="bg-[var(--card)] rounded-lg overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow">
                <Image
                  src={images[32]}
                  alt="Bistro & Bar"
                  className="h-[300px] w-full object-cover"
                  sizes="100vw"
                />
                <div className="p-6">
                  <h3 className="font-display text-2xl mb-3">The Bistro</h3>
                  <p className="text-[var(--secondary)] mb-4">
                    A relaxed atmosphere serving classic dishes with a modern twist, perfect for lunch or evening drinks.
                  </p>
                  <a href="#" className="btn-outline">View Menu</a>
                </div>
              </div>
              {/* Restaurant 3 */}
              <div className="bg-[var(--card)] rounded-lg overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow">
                <Image
                  src={images[33]}
                  alt="In-Room Dining"
                  className="h-[300px] w-full object-cover"
                  sizes="100vw"
                />
                <div className="p-6">
                  <h3 className="font-display text-2xl mb-3">In-Room Dining</h3>
                  <p className="text-[var(--secondary)] mb-4">
                    Enjoy gourmet meals in the comfort of your room, available 24 hours a day.
                  </p>
                  <a href="#" className="btn-outline">View Menu</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Culinary Experience */}
        <section className="section-padding bg-[var(--card)]">
          <div className="container-custom">
            <div className="text-center mb-12">
              <p className="text-sm tracking-[0.2em] uppercase text-[var(--secondary)] mb-4">Experiences</p>
              <h2 className="font-display text-4xl md:text-5xl mb-6">Culinary Journeys</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <h3 className="font-display text-2xl mb-4">Wine Pairing Dinner</h3>
                <p className="text-[var(--secondary)] mb-4">
                  Enjoy an exclusive evening of expertly paired wines and gourmet dishes in our private dining room.
                </p>
                <a href="#" className="btn-outline">Learn More</a>
              </div>
              <div className="space-y-6">
                <h3 className="font-display text-2xl mb-4">Cooking Class with Chef</h3>
                <p className="text-[var(--secondary)] mb-4">
                  Learn the secrets of our cuisine with a hands-on cooking class led by our executive chef.
                </p>
                <a href="#" className="btn-outline">Learn More</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}