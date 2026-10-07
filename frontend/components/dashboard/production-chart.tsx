"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { relatorioService } from "@/services/relatorio.service"
import type { ProducaoVendasPontoDto } from "@/lib/types"

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
  const [chartData, setChartData] = useState<ProducaoVendasPontoDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregarGrafico() {
      setLoading(true)
      try {
        const res = await relatorioService.grafico(period === "diario" ? "DIARIO" : "MENSAL")
        setChartData(res.producaoVendas || [])
      } catch (err) {
        console.error("Erro ao carregar gráfico de produção:", err)
      } finally {
        setLoading(false)
      }
    }
    carregarGrafico()
  }, [period])

  return (
    <Card className="border-border/60">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">Produção vs Vendas</CardTitle>
            <CardDescription className="text-xs">Quantidade de unidades por período</CardDescription>
          </div>
          <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg">
            <Button
              variant={period === "diario" ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs px-2.5"
              onClick={() => setPeriod("diario")}
            >
              Diário
            </Button>
            <Button
              variant={period === "mensal" ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs px-2.5"
              onClick={() => setPeriod("mensal")}
            >
              Mensal
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[240px] flex items-center justify-center text-xs text-muted-foreground">
            <Loader2 className="size-5 animate-spin mr-2 opacity-50" />
            Carregando gráfico...
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[240px] flex items-center justify-center text-xs text-muted-foreground">
            Sem dados de produção registrados para o período.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[240px] w-full">
            <BarChart data={chartData} barGap={4}>
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
                width={40}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="producao" fill="var(--color-producao)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="vendas" fill="var(--color-vendas)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
