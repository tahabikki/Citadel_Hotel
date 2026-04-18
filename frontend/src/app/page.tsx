import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { BookingSection } from "@/components/BookingSection";
import { RoomsSection } from "@/components/RoomsSection";
import { AboutSection } from "@/components/AboutSection";
import { OffersSection } from "@/components/OffersSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";

export const metadata: Metadata = {
  title: "Citadel Hôtel | Luxury Hotel in Calais, France",
  description: "Experience luxury at Citadel Hôtel in Calais. Elegant rooms, fine dining, and exceptional service.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <BookingSection />
        <AboutSection />
        <RoomsSection />
        <OffersSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  );
}