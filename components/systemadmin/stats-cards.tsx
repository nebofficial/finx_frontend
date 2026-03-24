import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Building2, CreditCard, TrendingUp } from 'lucide-react'

interface StatCard {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  color: string
}

const stats: StatCard[] = [
  {
    title: 'Total Users',
    value: '2,543',
    change: '+12% from last month',
    icon: <Users className="w-6 h-6" />,
    color: 'text-green-600',
  },
  {
    title: 'Active Tenants',
    value: '48',
    change: '+3% from last month',
    icon: <Building2 className="w-6 h-6" />,
    color: 'text-blue-600',
  },
  {
    title: 'Monthly Revenue',
    value: 'रू 24,500',
    change: '+8% from last month',
    icon: <CreditCard className="w-6 h-6" />,
    color: 'text-yellow-600',
  },
  {
    title: 'System Health',
    value: '99.8%',
    change: 'All systems operational',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'text-green-600',
  },
]

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              {stat.title}
            </CardTitle>
            <div className={`${stat.color}`}>{stat.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
