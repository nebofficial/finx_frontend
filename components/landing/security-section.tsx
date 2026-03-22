'use client';

import { Lock, Database, FileText, Cloud } from 'lucide-react';

const securityFeatures = [
  {
    icon: Lock,
    title: 'Data Isolation per Tenant',
    description: 'Each cooperative has completely isolated databases with end-to-end encryption'
  },
  {
    icon: Database,
    title: 'Encryption Policies',
    description: 'Military-grade encryption at rest and in transit for all sensitive data'
  },
  {
    icon: FileText,
    title: 'Audit Logs',
    description: 'Comprehensive audit trails of all system activities and user actions'
  },
  {
    icon: Cloud,
    title: 'Automated Backups',
    description: 'Regular automated backups with point-in-time recovery options'
  }
];

export function SecuritySection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Built for Enterprise-Grade Security
          </h2>
          <p className="text-xl text-muted-foreground">
            Your data security is our top priority
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="p-8 rounded-lg border border-border bg-background hover:border-accent/50 transition-colors"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                  <Icon className="h-6 w-6 text-destructive" />
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
