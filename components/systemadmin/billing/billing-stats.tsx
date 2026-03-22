import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp, Users, Calendar } from 'lucide-react'

const stats = [
  {
    title: 'Total Revenue (MRR)',
    value: '$48,500',
    change: '+15% from last month',
    icon: <DollarSign className="w-6 h-6" />,
    color: 'text-green-600',
  },
  {
    title: 'Active Subscriptions',
    value: '48',
    change: '+5 new this month',
    icon: <Users className="w-6 h-6" />,
    color: 'text-blue-600',
  },
  {
    title: 'Churn Rate',
    value: '2.1%',
    change: '-0.5% improvement',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'text-yellow-600',
  },
  {
    title: 'Next Renewal',
    value: '23 days',
    change: '45 subscriptions due',
    icon: <Calendar className="w-6 h-6" />,
    color: 'text-red-600',
  },
]

export default function BillingStats() {
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
