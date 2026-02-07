"use client";

import { Header } from "@/components/layout/Header";
import { TopBar } from "@/components/layout/TopBar";
import { Hero } from "@/components/home/Hero";
import { ImpactStats } from "@/components/home/ImpactStats";
import { Benefits } from "@/components/home/Benefits";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PromoBanners } from "@/components/home/PromoBanners";
import { Categories } from "@/components/home/Categories";
import { Testimonials } from "@/components/home/Testimonials";
import { Footer } from "@/components/layout/Footer";
import { LanguageProvider } from "@/components/context/LanguageContext";

export default function Home() {
  return (
    <LanguageProvider>
      <main className="min-h-screen bg-background font-sans">
        <TopBar />
        <Header />
        <Hero />
        <ImpactStats />
        <Benefits />
        <FeaturedProducts />
        <PromoBanners />
        <Categories />
        <Testimonials />
        <Footer />
      </main>
    </LanguageProvider>
  );
}
