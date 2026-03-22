'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative w-full overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-accent"></div>
          <span className="text-sm font-medium text-muted-foreground">Now available for all cooperative platforms</span>
        </div>
        
        <h1 className="mb-6 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
          Run & Scale Unlimited Cooperatives from One Powerful Platform
        </h1>
        
        <p className="mb-12 text-xl text-muted-foreground max-w-2xl mx-auto">
          Multi-tenant SaaS platform to manage cooperatives, users, billing, and security — all in one place.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="gap-2 bg-primary hover:bg-primary-light text-primary-foreground px-8"
          >
            Start Free Trial <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="px-8 border-border hover:bg-card"
          >
            Request Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
