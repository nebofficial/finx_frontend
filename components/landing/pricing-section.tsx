'use client';

import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Trial',
    description: 'Perfect for getting started',
    price: 'Free',
    features: [
      'Up to 5 cooperatives',
      'Basic user management',
      '1 GB storage',
      'Email support',
      'API access limited'
    ],
    highlighted: false
  },
  {
    name: 'Basic',
    description: 'For small cooperatives',
    price: '₹4,999',
    period: '/month',
    features: [
      'Up to 50 cooperatives',
      'Advanced user management',
      '100 GB storage',
      'Priority email support',
      'Full API access',
      'Basic analytics',
      'Automated backups'
    ],
    highlighted: true
  },
  {
    name: 'Premium',
    description: 'For enterprise scale',
    price: '₹14,999',
    period: '/month',
    features: [
      'Unlimited cooperatives',
      'Complete user management',
      'Unlimited storage',
      '24/7 phone & chat support',
      'Advanced API features',
      'Real-time analytics',
      'Custom integrations',
      'Dedicated account manager'
    ],
    highlighted: false
  }
];

export function PricingSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose the plan that's right for your business
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative p-8 rounded-lg border transition-all ${
                plan.highlighted 
                  ? 'border-primary bg-primary/5 shadow-lg md:scale-105' 
                  : 'border-border bg-card hover:border-border'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {plan.name}
              </h3>
              <p className="text-muted-foreground mb-6 text-sm">
                {plan.description}
              </p>
              
              <div className="mb-8">
                <span className="text-4xl font-bold text-foreground">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-muted-foreground ml-2">
                    {plan.period}
                  </span>
                )}
              </div>
              
              <Button 
                className="w-full mb-8"
                variant={plan.highlighted ? "default" : "outline"}
                size="lg"
              >
                {plan.name === 'Trial' ? 'Start Free' : 'Get Started'}
              </Button>
              
              <div className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
