"use client";

import { CarouselMy } from "@/components/us/CarouselMy";
import { Hero } from "@/components/us/Hero";
import { WhyChooseUs } from "@/components/us/WhyChooseUs";
import { Map } from "@/components/event-halls/map";
import { LayoutFooter } from "@/components/us/LayoutFooter";
export default function Page() {
  return (
    <main className="h-screen overflow-y-scroll snap-y snap-mandatory">
      <CarouselMy halls={[]} />
      <Hero />
      <Map />
      <WhyChooseUs />
      <LayoutFooter />
    </main>
  );
}
