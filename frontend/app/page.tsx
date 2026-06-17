import { AppLayout } from "@/components/app-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ProductionChart } from "@/components/dashboard/production-chart"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { CategoryChart } from "@/components/dashboard/category-chart"
import { LowStockTable } from "@/components/dashboard/low-stock-table"

export default function DashboardPage() {
  return (
    <AppLayout
      title="Dashboard"
      description="Visão geral da produção e vendas da padaria"
    >
      <div className="flex flex-col gap-6">
        <StatsCards />
        <div className="grid gap-4 lg:grid-cols-2">
          <ProductionChart />
          <RevenueChart />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LowStockTable />
          </div>
          <CategoryChart />
        </div>
      </div>
    </AppLayout>
  )
}
