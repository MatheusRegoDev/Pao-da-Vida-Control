"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts"
import { dailyProduction, monthlyProduction } from "@/lib/data"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const chartConfig = {
  producao: {
    label: "Produção",
    color: "var(--chart-1)",
  },
  vendas: {
    label: "Vendas",
    color: "var(--chart-2)",
  },
}

export function ProductionChart() {
  const [period, setPeriod] = useState<"diario" | "mensal">("diario")
  const data = period === "diario" ? dailyProduction : monthlyProduction
  const xKey = period === "diario" ? "dia" : "mes"

  return (
    <Card className="border-border/60">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">Produção vs Vendas</CardTitle>
            <CardDescription className="text-xs">Quantidade de unidades por período</CardDescription>
          </div>
          <ToggleGroup type="single" value={period} onValueChange={(v) => v && setPeriod(v as "diario" | "mensal")} size="sm">
            <ToggleGroupItem value="diario" className="text-xs px-3 h-7">Diário</ToggleGroupItem>
            <ToggleGroupItem value="mensal" className="text-xs px-3 h-7">Mensal</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[240px] w-full">
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} width={40} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="producao" fill="var(--color-producao)" radius={[4, 4, 0, 0]} maxBarSize={36} />
            <Bar dataKey="vendas" fill="var(--color-vendas)" radius={[4, 4, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
