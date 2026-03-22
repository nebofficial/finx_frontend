'use client';

import { Settings, Users, CreditCard, Shield, Key, Headphones, Building2, UserCheck, Banknote, Wallet, TrendingUp, BarChart3, Lock, Bell, FileText, Zap } from 'lucide-react';

export function FeaturesSection() {
  const superadminFeatures = [
    {
      icon: Building2,
      title: "Tenant Management",
      color: "green",
      items: [
        "Create, activate, suspend cooperatives",
        "Auto database provisioning",
        "Backup & restore",
        "Usage analytics"
      ]
    },
    {
      icon: Users,
      title: "User & Role Control",
      color: "green",
      items: [
        "Global system users",
        "Role hierarchy & permissions",
        "Force logout & password reset",
        "Granular access control"
      ]
    },
    {
      icon: CreditCard,
      title: "Billing & Subscription",
      color: "red",
      items: [
        "Plans: Trial / Basic / Premium",
        "Payment gateway integration",
        "Coupons & discounts",
        "Auto-expiry & invoicing"
      ]
    },
    {
      icon: Shield,
      title: "Monitoring & Security",
      color: "blue",
      items: [
        "Login tracking",
        "API monitoring",
        "Suspicious activity alerts",
        "Compliance reporting"
      ]
    },
    {
      icon: Key,
      title: "API & Integration",
      color: "yellow",
      items: [
        "API key generation",
        "Rate limiting",
        "Usage tracking",
        "Webhook support"
      ]
    },
    {
      icon: Headphones,
      title: "Support Tools",
      color: "green",
      items: [
        "Tenant impersonation",
        "Centralized helpdesk",
        "Issue resolution dashboard",
        "Real-time support chat"
      ]
    }
  ];

  const tenantFeatures = [
    {
      icon: Building2,
      title: "Branch Management",
      color: "purple",
      items: [
        "Create multiple branches",
        "Assign BranchAdmin",
        "Transfer staff between branches",
        "Branch-wise performance reports"
      ]
    },
    {
      icon: UserCheck,
      title: "Member Management",
      color: "indigo",
      items: [
        "Register members",
        "KYC management (ID, documents)",
        "Member profile view/edit",
        "Member status tracking"
      ]
    },
    {
      icon: Banknote,
      title: "Deposit Management",
      color: "emerald",
      items: [
        "Create Deposit Accounts (FD, Saving)",
        "Deposit / Withdraw",
        "Interest calculation setup",
        "Deposit statements"
      ]
    },
    {
      icon: Wallet,
      title: "Loan Management",
      color: "cyan",
      items: [
        "Loan application",
        "Loan approval workflow",
        "Loan disbursement",
        "EMI schedule generation"
      ]
    },
    {
      icon: TrendingUp,
      title: "Transaction Management",
      color: "amber",
      items: [
        "Cash / Bank transactions",
        "Receipt entry",
        "Payment entry",
        "Transfer between accounts"
      ]
    },
    {
      icon: BarChart3,
      title: "Accounting & Ledger",
      color: "rose",
      items: [
        "General Ledger (GL)",
        "Sub Ledger",
        "Cash / Bank Ledger",
        "Trial Balance"
      ]
    },
    {
      icon: Lock,
      title: "Role & Permission System",
      color: "violet",
      items: [
        "Create custom roles",
        "Module-wise permissions",
        "Action-wise access control",
        "Edit / delete roles"
      ]
    },
    {
      icon: Bell,
      title: "Notifications & Alerts",
      color: "orange",
      items: [
        "Send notices to staff & members",
        "Loan due alerts",
        "Low balance alerts",
        "System notifications"
      ]
    },
    {
      icon: FileText,
      title: "Reports & Analytics",
      color: "lime",
      items: [
        "Daily Transaction Report",
        "Loan Report",
        "Deposit Report",
        "Member Report"
      ]
    },
    {
      icon: Zap,
      title: "System Configuration",
      color: "sky",
      items: [
        "Interest rates",
        "Loan policies",
        "Account settings",
        "SMS & Email setup"
      ]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Platform Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enterprise-grade management system for cooperative platforms with multi-tenant support, advanced billing, and comprehensive monitoring
          </p>
        </div>

        {/* SuperAdmin Features */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">SuperAdmin Dashboard Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {superadminFeatures.map((feature, idx) => {
            const IconComponent = feature.icon;
            const colorClasses = {
              green: "border-green-500 bg-green-50",
              red: "border-red-500 bg-red-50",
              blue: "border-blue-500 bg-blue-50",
              yellow: "border-yellow-500 bg-yellow-50"
            };
            return (
              <div key={idx} className={`bg-white rounded-lg p-6 border-2 ${colorClasses[feature.color as keyof typeof colorClasses]} hover:shadow-lg transition-shadow`}>
                <div className="flex items-center gap-3 mb-4">
                  <IconComponent className="w-6 h-6" style={{ color: feature.color === 'green' ? '#16a34a' : feature.color === 'red' ? '#dc2626' : feature.color === 'blue' ? '#2563eb' : '#ca8a04' }} />
                  <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <ul className="space-y-2">
                  {feature.items.map((item, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        </div>

        {/* Tenant Features */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Tenant Management Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tenantFeatures.map((feature, idx) => {
              const IconComponent = feature.icon;
              const colorMap = {
                purple: "#a855f7",
                indigo: "#6366f1",
                emerald: "#10b981",
                cyan: "#06b6d4",
                amber: "#f59e0b",
                rose: "#f43f5e",
                violet: "#8b5cf6",
                orange: "#f97316",
                lime: "#84cc16",
                sky: "#0ea5e9"
              };
              const borderColorMap = {
                purple: "border-purple-500 bg-purple-50",
                indigo: "border-indigo-500 bg-indigo-50",
                emerald: "border-emerald-500 bg-emerald-50",
                cyan: "border-cyan-500 bg-cyan-50",
                amber: "border-amber-500 bg-amber-50",
                rose: "border-rose-500 bg-rose-50",
                violet: "border-violet-500 bg-violet-50",
                orange: "border-orange-500 bg-orange-50",
                lime: "border-lime-500 bg-lime-50",
                sky: "border-sky-500 bg-sky-50"
              };
              return (
                <div key={idx} className={`bg-white rounded-lg p-6 border-2 ${borderColorMap[feature.color as keyof typeof borderColorMap]} hover:shadow-lg transition-shadow`}>
                  <div className="flex items-center gap-3 mb-4">
                    <IconComponent className="w-6 h-6" style={{ color: colorMap[feature.color as keyof typeof colorMap] }} />
                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {feature.items.map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
