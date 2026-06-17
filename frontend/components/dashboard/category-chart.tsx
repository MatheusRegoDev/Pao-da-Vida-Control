"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell } from "recharts"
import { categoryDistribution } from "@/lib/data"

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "oklch(0.72 0.06 60)",
]

const chartConfig = Object.fromEntries(
  categoryDistribution.map((c, i) => [
    c.categoria.toLowerCase().replace(/\s/g, '_'),
    { label: c.categoria, color: COLORS[i] },
  ])
)

export function CategoryChart() {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Vendas por Categoria</CardTitle>
        <CardDescription className="text-xs">Distribuição das vendas do período</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <ChartContainer config={chartConfig} className="h-[200px] w-[200px] shrink-0">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="categoria" />} />
              <Pie
                data={categoryDistribution}
                dataKey="quantidade"
                nameKey="categoria"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                strokeWidth={2}
                stroke="var(--card)"
              >
                {categoryDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="flex flex-1 flex-col gap-2">
            {categoryDistribution.map((cat, i) => {
              const total = categoryDistribution.reduce((s, c) => s + c.quantidade, 0)
              const pct = ((cat.quantidade / total) * 100).toFixed(1)
              return (
                <div key={cat.categoria} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="size-2.5 shrink-0 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="truncate text-xs text-foreground">{cat.categoria}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                    <span>{cat.quantidade}</span>
                    <span className="text-muted-foreground/60">({pct}%)</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
