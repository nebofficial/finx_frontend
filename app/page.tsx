import type { Metadata } from 'next';
import { Header } from '@/components/landing/header';
import { HeroSection } from '@/components/landing/hero-section';
import { ValueProposition } from '@/components/landing/value-proposition';
import { FeaturesSection } from '@/components/landing/features-section';
import { PricingSection } from '@/components/landing/pricing-section';
import { SecuritySection } from '@/components/landing/security-section';
import { FAQSection } from '@/components/landing/faq-section';
import { CTASection } from '@/components/landing/cta-section';
import { Footer } from '@/components/landing/footer';

export const metadata: Metadata = {
  title: 'CoopHub - SaaS Platform for Cooperative Management',
  description: 'Run and scale unlimited cooperatives from one powerful platform. Multi-tenant SaaS solution with enterprise security, billing, and user management.',
  keywords: 'cooperative management, SaaS platform, multi-tenant, billing management, role-based access',
  openGraph: {
    title: 'CoopHub - Cooperative Management Platform',
    description: 'Scale your cooperatives with enterprise-grade features and security',
    type: 'website',
  }
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ValueProposition />
      <FeaturesSection />
      <PricingSection />
      <SecuritySection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
