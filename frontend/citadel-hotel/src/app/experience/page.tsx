import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Experiences | Citadel Hôtel",
  description: "Discover the best of Calais and beyond with Citadel Hôtel's curated experiences.",
};

export default function ExperiencePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-200px)]">
        {/* Experience Hero */}
        <section className="relative h-[600px] bg-[var(--background)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/20 to-[var(--primary)]/40" />
          <Image
            src={images[10]} // Assuming this is an experience image
            alt="Citadel Hôtel Experiences"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-6">
            <h2 className="font-display text-4xl md:text-5xl mb-4">Curated Experiences</h2>
            <p className="text-lg text-[var(--secondary)] mb-8">
              Explore the rich culture, history, and beauty of Calais with our handpicked experiences.
            </p>
            <div className="flex gap-4">
              <button className="btn-primary">Browse Experiences</button>
              <button className="btn-outline">Contact Concierge</button>
            </div>
          </div>
        </section>

        {/* Experiences Section */}
        <section className="section-padding bg-[var(--background)]">
          <div className="container-custom">
            <div className="text-center mb-12">
              <p className="text-sm tracking-[0.2em] uppercase text-[var(--secondary)] mb-4">Experiences</p>
              <h2 className="font-display text-4xl md:text-5xl mb-6">Discover Calais</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Experience 1 */}
              <div className="bg-[var(--card)] rounded-lg overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow">
                <Image
                  src={images[11]}
                  alt="Historical Tour"
                  className="h-[300px] w-full object-cover"
                  sizes="100vw"
                />
                <div className="p-6">
                  <h3 className="font-display text-2xl mb-3">Historical Calais Tour</h3>
                  <p className="text-[var(--secondary)] mb-4">
                    Discover the rich history of Calais with a guided tour of its landmarks and museums.
                  </p>
                  <a href="#" className="btn-outline">Learn More</a>
                </div>
              </div>
              {/* Experience 2 */}
              <div className="bg-[var(--card)] rounded-lg overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow">
                <Image
                  src={images[12]}
                  alt="Beach Excursion"
                  className="h-[300px] w-full object-cover"
                  sizes="100vw"
                />
                <div className="p-6">
                  <h3 className="font-display text-2xl mb-3">Beach & Coastal Excursion</h3>
                  <p className="text-[var(--secondary)] mb-4">
                    Enjoy a day at the beach or explore the stunning coastline surrounding Calais.
                  </p>
                  <a href="#" className="btn-outline">Learn More</a>
                </div>
              </div>
              {/* Experience 3 */}
              <div className="bg-[var(--card)] rounded-lg overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow">
                <Image
                  src={images[13]}
                  alt="Shopping Experience"
                  className="h-[300px] w-full object-cover"
                  sizes="100vw"
                />
                <div className="p-6">
                  <h3 className="font-display text-2xl mb-3">Personal Shopping Experience</h3>
                  <p className="text-[var(--secondary)] mb-4">
                    Enjoy a personalized shopping experience with our concierge in Calais' best boutiques.
                  </p>
                  <a href="#" className="btn-outline">Learn More</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Concierge Section */}
        <section className="section-padding bg-[var(--card)]">
          <div className="container-custom">
            <div className="text-center mb-12">
              <p className="text-sm tracking-[0.2em] uppercase text-[var(--secondary)] mb-4">Concierge</p>
              <h2 className="font-display text-4xl md:text-5xl mb-6">Your Personal Assistant</h2>
            </div>
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4">
                  <h3 className="font-display text-2xl mb-4">24/7 Concierge Service</h3>
                  <p className="text-[var(--secondary)]">
                    Our dedicated concierge team is available around the clock to assist with reservations, 
                    recommendations, and any special requests to make your stay unforgettable.
                  </p>
                </div>
                <Image
                  src={images[14]}
                  alt="Concierge"
                  className="h-[400px] w-[400px] object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}