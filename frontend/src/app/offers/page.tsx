import { Metadata } from "next";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { OffersSection } from "../../components/OffersSection";

export const metadata: Metadata = {
  title: "Offers | Citadel Hôtel",
  description: "Special offers and packages at Citadel Hôtel in Calais.",
};

export default function OffersPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="py-16 bg-[var(--card)]">
          <div className="container-custom text-center">
            <p className="text-sm tracking-[0.2em] uppercase text-[var(--secondary)] mb-4">Special Offers</p>
            <h1 className="font-display text-4xl md:text-5xl mb-6">Exclusive Offers</h1>
            <p className="text-[var(--secondary)] max-w-2xl mx-auto">
              Discover our special packages and exclusive deals for your stay at Citadel Hôtel.
            </p>
          </div>
        </section>
        <OffersSection />
      </main>
      <Footer />
    </>
  );
}