"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"
import { Loader2 } from "lucide-react"
import { relatorioService } from "@/services/relatorio.service"
import type { ReceitaPontoDto } from "@/lib/types"

const chartConfig = {
  receita: {
    label: "Receita (R$)",
    color: "var(--chart-1)",
  },
}

export function RevenueChart() {
  const [data, setData] = useState<ReceitaPontoDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await relatorioService.grafico("DIARIO")
        setData(res.receita || [])
      } catch (err) {
        console.error("Erro ao carregar receita:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Receita Diária</CardTitle>
        <CardDescription className="text-xs">Histórico recente de vendas em R$</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[240px] flex items-center justify-center text-xs text-muted-foreground">
            <Loader2 className="size-5 animate-spin mr-2 opacity-50" />
            Carregando receita...
          </div>
        ) : data.length === 0 ? (
          <div className="h-[240px] flex items-center justify-center text-xs text-muted-foreground">
            Sem dados de receita registrados recentemente.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[240px] w-full">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="receitaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                width={55}
                tickFormatter={v => `R$${v}`}
              />
              <ChartTooltip
                content={<ChartTooltipContent formatter={v => `R$ ${Number(v).toFixed(2).replace(".", ",")}`} />}
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
        )}
      </CardContent>
    </Card>
  )
}
