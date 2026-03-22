'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-primary-light">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-primary-foreground mb-6">
          Start Managing Your Entire SaaS Platform Today
        </h2>
        <p className="text-lg text-primary-foreground/90 mb-12">
          Join thousands of cooperative platforms that trust our solution for seamless management, security, and scalability.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="gap-2 bg-primary-foreground text-primary hover:bg-white px-8"
          >
            Start Free Trial <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="px-8 border-primary-foreground hover:bg-white/10 text-primary-foreground"
          >
            Book Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
