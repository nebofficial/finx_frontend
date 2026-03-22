'use client';

import { Building2, Lock, CreditCard, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Building2,
    title: 'Multi-Tenant Architecture',
    description: 'Create & manage unlimited cooperatives with isolated databases'
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'Role-based access, encryption, audit logs'
  },
  {
    icon: CreditCard,
    title: 'Smart Billing',
    description: 'Subscription plans, auto-renewals, invoices'
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Track growth, revenue, and system usage'
  }
];

export function ValueProposition() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Everything You Need to Run a SaaS Cooperative Platform
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful features designed for modern cooperative businesses
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="p-8 rounded-lg border border-border bg-card hover:bg-card-hover transition-colors"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
