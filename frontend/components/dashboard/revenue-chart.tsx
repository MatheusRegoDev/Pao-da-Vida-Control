"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"
import { revenueDailyData } from "@/lib/data"

const chartConfig = {
  receita: {
    label: "Receita (R$)",
    color: "var(--chart-1)",
  },
}

export function RevenueChart() {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Receita Diária</CardTitle>
        <CardDescription className="text-xs">Últimos 7 dias em R$</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[240px] w-full">
          <AreaChart data={revenueDailyData}>
            <defs>
              <linearGradient id="receitaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="dia" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              width={55}
              tickFormatter={(v) => `R$${v}`}
            />
            <ChartTooltip
              content={<ChartTooltipContent formatter={(v) => `R$ ${Number(v).toFixed(2).replace('.', ',')}`} />}
            />
            <Area
              type="monotone"
              dataKey="receita"
              stroke="var(--color-receita)"
              strokeWidth={2}
              fill="url(#receitaGrad)"
              dot={{ r: 3, fill: "var(--color-receita)", strokeWidth: 0 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
