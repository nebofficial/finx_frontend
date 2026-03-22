import AnalyticsCharts from '@/components/systemadmin/analytics/analytics-charts'
import AnalyticsMetrics from '@/components/systemadmin/analytics/analytics-metrics'
import UserGrowthChart from '@/components/systemadmin/analytics/user-growth-chart'
import ConversionFunnel from '@/components/systemadmin/analytics/conversion-funnel'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">System-wide analytics and insights</p>
      </div>

      <AnalyticsMetrics />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsCharts />
        <UserGrowthChart />
      </div>

      <ConversionFunnel />
    </div>
  )
}
