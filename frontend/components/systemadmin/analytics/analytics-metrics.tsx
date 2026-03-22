import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUp, ArrowDown } from 'lucide-react'

const metrics = [
  {
    title: 'Total Page Views',
    value: '145,230',
    change: '+23% vs last month',
    direction: 'up' as const,
    color: 'text-green-600',
  },
  {
    title: 'Avg. Session Duration',
    value: '4m 32s',
    change: '+12 sec vs last month',
    direction: 'up' as const,
    color: 'text-green-600',
  },
  {
    title: 'Bounce Rate',
    value: '32.5%',
    change: '-4.2% vs last month',
    direction: 'down' as const,
    color: 'text-green-600',
  },
  {
    title: 'Conversion Rate',
    value: '3.24%',
    change: '+0.5% vs last month',
    direction: 'up' as const,
    color: 'text-green-600',
  },
]

export default function AnalyticsMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-card-foreground">
              {metric.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground mb-2">{metric.value}</div>
            <div className="flex items-center gap-2">
              {metric.direction === 'up' ? (
                <ArrowUp size={16} className={metric.color} />
              ) : (
                <ArrowDown size={16} className={metric.color} />
              )}
              <span className="text-xs text-muted-foreground">{metric.change}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
