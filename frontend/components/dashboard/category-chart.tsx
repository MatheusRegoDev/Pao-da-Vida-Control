"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell } from "recharts"
import { Loader2 } from "lucide-react"
import { relatorioService } from "@/services/relatorio.service"
import type { CategoriaVendaDto } from "@/lib/types"

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "oklch(0.72 0.06 60)",
]

export function CategoryChart() {
  const [data, setData] = useState<CategoriaVendaDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregarCategorias() {
      try {
        const res = await relatorioService.vendasPorCategoria()
        setData(res || [])
      } catch (err) {
        console.error("Erro ao carregar distribuição de categorias:", err)
      } finally {
        setLoading(false)
      }
    }
    carregarCategorias()
  }, [])

  const chartConfig = Object.fromEntries(
    data.map((c, i) => [
      c.categoria.toLowerCase().replace(/\s/g, "_"),
      { label: c.categoria, color: COLORS[i % COLORS.length] },
    ])
  )

  const total = data.reduce((s, c) => s + (c.quantidade || 0), 0)

  return (
    <Card className="min-w-0 overflow-hidden border-border/60">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Vendas por Categoria</CardTitle>
        <CardDescription className="text-xs">Distribuição das vendas do período</CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {loading ? (
          <div className="h-[200px] flex items-center justify-center text-xs text-muted-foreground">
            <Loader2 className="size-5 animate-spin mr-2 opacity-50" />
            Carregando distribuição...
          </div>
        ) : data.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center text-xs text-muted-foreground">
            Nenhuma venda registrada por categoria.
          </div>
        ) : (
          <div className="flex min-w-0 flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
            <ChartContainer
              config={chartConfig}
              className="h-[170px] w-[170px] shrink-0 sm:h-[200px] sm:w-[200px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="categoria" />} />
                <Pie
                  data={data}
                  dataKey="quantidade"
                  nameKey="categoria"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  strokeWidth={2}
                  stroke="var(--card)"
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex flex-1 flex-col gap-2 w-full">
              {data.map((cat, i) => {
                const pct = total > 0 ? ((cat.quantidade / total) * 100).toFixed(1) : "0"
                return (
                  <div key={cat.categoria} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ background: COLORS[i % COLORS.length] }}
                      />
                      <span className="truncate text-xs font-medium text-foreground">
                        {cat.categoria}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground">{cat.quantidade} un.</span>
                      <span className="text-xs font-semibold text-foreground w-10 text-right">
                        {pct}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
