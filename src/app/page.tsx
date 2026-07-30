'use client';

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import DashboardPreview from '@/components/landing/DashboardPreview';
import HowItWorks from '@/components/landing/HowItWorks';
import WhySlash from '@/components/landing/WhySlash';
import FAQSection from '@/components/landing/FAQSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import CommandPalette from '@/components/ui/command-palette';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#635BFF]/10 selection:text-gray-900">
      <CommandPalette />
      <Navbar />
      
      {/* Hero Section (3D WebGL Glass Artwork LOCKED) */}
      <HeroSection />

      {/* Feature Cards (3 Cards) */}
      <FeaturesSection />

      {/* Product Preview (Dashboard Mockup) */}
      <DashboardPreview />

      {/* How It Works (3 Steps) */}
      <HowItWorks />

      {/* Why Slash (4 Premium Cards) */}
      <WhySlash />

      {/* FAQ (Accordion Q&A) */}
      <FAQSection />

      {/* Final Call to Action */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
