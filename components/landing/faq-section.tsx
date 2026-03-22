'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Can I manage multiple cooperatives?',
    answer: 'Yes! Our platform is built for multi-tenant management. You can create and manage unlimited cooperatives from a single dashboard, each with completely isolated databases and configurations.'
  },
  {
    question: 'Is data isolated between cooperatives?',
    answer: 'Absolutely. Each cooperative has its own isolated database environment. We maintain strict data isolation policies to ensure that no cooperative can access another\'s data, even in case of a security breach.'
  },
  {
    question: 'What payment gateways are supported?',
    answer: 'We support all major payment gateways including Stripe, Razorpay, PayPal, and custom integrations. You can configure multiple payment methods for your cooperatives.'
  },
  {
    question: 'Can I customize roles and permissions?',
    answer: 'Yes, our platform offers flexible role-based access control (RBAC) with customizable permissions. Create unlimited custom roles tailored to your organizational structure.'
  },
  {
    question: 'Do you provide API access?',
    answer: 'Yes, we provide comprehensive REST API with webhooks, rate limiting, and detailed documentation. API access is available on all paid plans with usage tracking and monitoring.'
  },
  {
    question: 'What support options are available?',
    answer: 'We offer email support on all plans. Premium plan customers get 24/7 phone and chat support, plus a dedicated account manager for seamless onboarding and support.'
  }
];

export function FAQSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="mx-auto max-w-2xl">
        <div className="mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about our platform
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-border rounded-lg px-6 overflow-hidden"
            >
              <AccordionTrigger className="text-lg font-semibold text-foreground hover:text-primary py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-0 pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
