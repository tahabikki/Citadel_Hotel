import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookingSearch } from "@/components/BookingSearch";

export const metadata: Metadata = {
  title: "Rooms & Suites | Citadel Hôtel",
  description: "Explore our luxurious rooms and suites at Citadel Hôtel. Find the perfect accommodation for your stay.",
};

export default function RoomsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-200px)]">
        {/* Hero Section */}
        <section className="relative h-[600px] bg-[var(--background)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/20 to-[var(--primary)]/40" />
          {/* Will be populated from images - using first available room image as placeholder */}
          <div className="absolute inset-0 bg-[var(--secondary)]/20" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-6">
            <h2 className="font-display text-4xl md:text-5xl mb-4">Luxury Accommodation</h2>
            <p className="text-lg text-[var(--secondary)] mb-8">
              Discover our collection of elegantly appointed rooms and suites, each designed for ultimate comfort.
            </p>
            <div className="flex gap-4">
              <button className="btn-primary">Check Availability</button>
              <button className="btn-outline">View All Rooms</button>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="relative -mt-20 z-20">
          <BookingSearch />
        </section>

        {/* Rooms Introduction */}
        <section className="section-padding bg-[var(--background)]">
          <div className="container-custom">
            <div className="text-center mb-16">
              <p className="text-sm tracking-[0.2em] uppercase text-[var(--secondary)] mb-4">Our Collection</p>
              <h2 className="font-display text-4xl md:text-5xl mb-6">Exquisite Rooms & Suites</h2>
              <p className="text-lg text-[var(--secondary)] mb-8 max-w-2xl mx-auto">
                Each room at Citadel Hôtel is meticulously designed to provide a sanctuary of comfort and style, 
                featuring premium amenities and thoughtful details.
              </p>
            </div>
          </div>
        </section>

        {/* Room Categories */}
        <section className="section-padding bg-[var(--card)]">
          <div className="container-custom">
            <div className="mb-12">
              <h2 className="font-display text-3xl md:text-4xl text-center mb-6">Room Categories</h2>
              <p className="text-center text-[var(--secondary)] max-w-2xl mx-auto">
                Choose from our thoughtfully curated selection of rooms and suites.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Category 1 */}
              <div className="bg-[var(--background)] rounded-xl overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow group">
                <div className="h-[200px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[var(--primary)]/10" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl mb-3">Superior Rooms</h3>
                  <p className="text-[var(--secondary)] mb-4">
                    Elegantly appointed rooms featuring premium bedding and modern amenities.
                  </p>
                  <a href="#" className="btn-outline">Explore</a>
                </div>
              </div>
              {/* Category 2 */}
              <div className="bg-[var(--background)] rounded-xl overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow group">
                <div className="h-[200px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[var(--primary)]/10" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl mb-3">Deluxe Suites</h3>
                  <p className="text-[var(--secondary)] mb-4">
                    Spacious suites with separate living areas and upgraded amenities.
                  </p>
                  <a href="#" className="btn-outline">Explore</a>
                </div>
              </div>
              {/* Category 3 */}
              <div className="bg-[var(--background)] rounded-xl overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow group">
                <div className="h-[200px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[var(--primary)]/10" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl mb-3">Family Rooms</h3>
                  <p className="text-[var(--secondary)] mb-4">
                    Thoughtfully designed spaces perfect for families traveling together.
                  </p>
                  <a href="#" className="btn-outline">Explore</a>
                </div>
              </div>
              {/* Category 4 */}
              <div className="bg-[var(--background)] rounded-xl overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow group">
                <div className="h-[200px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[var(--primary)]/10" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl mb-3">Accessible Rooms</h3>
                  <p className="text-[var(--secondary)] mb-4">
                    Fully accessible rooms designed for comfort and ease of use.
                  </p>
                  <a href="#" className="btn-outline">Explore</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}