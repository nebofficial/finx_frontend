import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle, Clock, BarChart3 } from 'lucide-react'

const stats = [
  {
    title: 'Open Tickets',
    value: '12',
    change: '3 pending response',
    icon: <AlertCircle className="w-6 h-6" />,
    color: 'text-red-600',
  },
  {
    title: 'Resolved Today',
    value: '8',
    change: '100% satisfaction',
    icon: <CheckCircle className="w-6 h-6" />,
    color: 'text-green-600',
  },
  {
    title: 'Avg. Response Time',
    value: '2.4h',
    change: 'Improved from 3.2h',
    icon: <Clock className="w-6 h-6" />,
    color: 'text-blue-600',
  },
  {
    title: 'Customer Satisfaction',
    value: '4.8/5',
    change: '+0.2 from last month',
    icon: <BarChart3 className="w-6 h-6" />,
    color: 'text-yellow-600',
  },
]

export default function SupportStats() {
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
