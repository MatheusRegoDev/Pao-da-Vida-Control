"use client"

import { AppLayout } from "@/components/app-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ProductionChart } from "@/components/dashboard/production-chart"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { CategoryChart } from "@/components/dashboard/category-chart"
import { LowStockTable } from "@/components/dashboard/low-stock-table"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPage() {
  const { usuario } = useAuth()

  return (
    <AppLayout
      title="Dashboard"
      description="Visão geral da produção e vendas da padaria"
    >
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Bem-vindo{usuario?.nome ? `, ${usuario.nome}` : ""}
          </h2>
          <p className="text-sm text-muted-foreground">
            Acompanhe o desempenho da sua padaria hoje em tempo real.
          </p>
        </div>
        <StatsCards />
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
          <ProductionChart />
          <RevenueChart />
        </div>
        <div className="grid min-w-0 gap-3 sm:gap-4 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            <LowStockTable />
          </div>
          <CategoryChart />
        </div>
      </div>
    </AppLayout>
  )
}
