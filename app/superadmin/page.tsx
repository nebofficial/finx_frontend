import DashboardHeader from '@/components/superadmin/dashboard-header'
import StatsCards from '@/components/superadmin/stats-cards'
import RecentActivity from '@/components/superadmin/recent-activity'
import MetricsChart from '@/components/superadmin/metrics-chart'

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MetricsChart />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}
