import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface FunnelStep {
  name: string
  count: number
  conversion: number
}

const funnelData: FunnelStep[] = [
  { name: 'Landing Page Views', count: 10000, conversion: 100 },
  { name: 'Account Signup', count: 4500, conversion: 45 },
  { name: 'Email Verification', count: 3800, conversion: 38 },
  { name: 'First Login', count: 3200, conversion: 32 },
  { name: 'Subscription Start', count: 1543, conversion: 15.43 },
]

export default function ConversionFunnel() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Conversion Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {funnelData.map((step, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-card-foreground">{step.name}</span>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{step.count.toLocaleString()}</span>
                  <span className="font-semibold text-foreground">{step.conversion.toFixed(2)}%</span>
                </div>
              </div>
              <Progress value={step.conversion} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
