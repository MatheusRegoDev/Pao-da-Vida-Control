"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, BarChart3, Package, DollarSign } from "lucide-react"
import {
  dailyProduction, monthlyProduction, revenueDailyData,
  categoryDistribution, products, stockEntries, stockExits,
} from "@/lib/data"

const prodVendasConfig = {
  producao: { label: "Produção", color: "var(--chart-1)" },
  vendas: { label: "Vendas", color: "var(--chart-2)" },
}

const receitaConfig = {
  receita: { label: "Receita (R$)", color: "var(--chart-1)" },
}

const PIE_COLORS = [
  "var(--chart-1)", "var(--chart-2)", "var(--chart-3)",
  "var(--chart-4)", "var(--chart-5)", "oklch(0.72 0.06 60)",
]

// Top 5 produtos por saída
const topProductos = products
  .map(p => {
    const totalSaidas = stockExits.filter(e => e.produtoId === p.id).reduce((a, e) => a + e.quantidade, 0)
    const receita = stockExits.filter(e => e.produtoId === p.id).reduce((a, e) => a + e.valorTotal, 0)
    return { ...p, totalSaidas, receita }
  })
  .sort((a, b) => b.totalSaidas - a.totalSaidas)
  .slice(0, 5)

const topProdConfig = Object.fromEntries(
  topProductos.map((p, i) => [p.nome, { label: p.nome, color: PIE_COLORS[i] }])
)

// Receita mensal com dados simulados
const revenueMonthly = monthlyProduction.map((m, i) => ({
  mes: m.mes,
  receita: [18900, 21500, 25100, 22800, 28700, 20200][i],
}))

export default function RelatoriosPage() {
  const [periodo, setPeriodo] = useState<"diario" | "mensal">("diario")

  const prodData = periodo === "diario" ? dailyProduction : monthlyProduction
  const recData = periodo === "diario" ? revenueDailyData : revenueMonthly
  const xKey = periodo === "diario" ? "dia" : "mes"

  const totalProducao = dailyProduction.reduce((a, d) => a + d.producao, 0)
  const totalVendas = dailyProduction.reduce((a, d) => a + d.vendas, 0)
  const totalReceita = revenueDailyData.reduce((a, d) => a + d.receita, 0)
  const aproveitamento = ((totalVendas / totalProducao) * 100).toFixed(1)

  return (
    <AppLayout title="Gráficos e Análises" description="Relatórios de produção e vendas por período">
      <div className="flex flex-col gap-6">
        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Produção (7 dias)", value: totalProducao.toLocaleString("pt-BR"), sub: "unidades", icon: Package, color: "text-chart-1", bg: "bg-chart-1/10" },
            { label: "Vendas (7 dias)", value: totalVendas.toLocaleString("pt-BR"), sub: "unidades", icon: TrendingUp, color: "text-chart-2", bg: "bg-chart-2/10" },
            { label: "Receita (7 dias)", value: `R$ ${totalReceita.toFixed(2).replace(".", ",")}`, sub: "faturamento", icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
            { label: "Aproveitamento", value: `${aproveitamento}%`, sub: "prod. vendida", icon: BarChart3, color: "text-primary", bg: "bg-primary/10" },
          ].map(s => (
            <Card key={s.label} className="border-border/60">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <div className={`flex size-7 items-center justify-center rounded-md ${s.bg}`}>
                    <s.icon className={`size-3.5 ${s.color}`} />
                  </div>
                </div>
                <p className="text-xl font-bold text-foreground truncate">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Period toggle */}
        <div className="flex items-center gap-3">
          <Tabs value={periodo} onValueChange={v => setPeriodo(v as "diario" | "mensal")} className="w-fit">
            <TabsList>
              <TabsTrigger value="diario" className="text-xs px-4">Análise Diária</TabsTrigger>
              <TabsTrigger value="mensal" className="text-xs px-4">Análise Mensal</TabsTrigger>
            </TabsList>
          </Tabs>
          <span className="text-xs text-muted-foreground">
            {periodo === "diario" ? "Últimos 7 dias" : "Últimos 6 meses"}
          </span>
        </div>

        {/* Main charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Produção vs Vendas */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Produção vs Vendas</CardTitle>
              <CardDescription className="text-xs">Comparativo de unidades produzidas e vendidas</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={prodVendasConfig} className="h-[260px] w-full">
                <BarChart data={prodData} barGap={4}>
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

          {/* Receita */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Evolução da Receita</CardTitle>
              <CardDescription className="text-xs">Faturamento por {periodo === "diario" ? "dia" : "mês"} em R$</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={receitaConfig} className="h-[260px] w-full">
                <AreaChart data={recData}>
                  <defs>
                    <linearGradient id="recGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} width={60} tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
                  <ChartTooltip content={<ChartTooltipContent formatter={v => `R$ ${Number(v).toFixed(2).replace(".", ",")}`} />} />
                  <Area type="monotone" dataKey="receita" stroke="var(--color-receita)" strokeWidth={2} fill="url(#recGrad2)" dot={{ r: 3, fill: "var(--color-receita)", strokeWidth: 0 }} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom charts */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Distribuição por categoria */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Vendas por Categoria</CardTitle>
              <CardDescription className="text-xs">Distribuição percentual</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={topProdConfig} className="h-[180px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="categoria" />} />
                  <Pie data={categoryDistribution} dataKey="quantidade" nameKey="categoria" cx="50%" cy="50%" innerRadius={48} outerRadius={75} strokeWidth={2} stroke="var(--card)">
                    {categoryDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="mt-3 flex flex-col gap-1.5">
                {categoryDistribution.map((c, i) => {
                  const total = categoryDistribution.reduce((s, d) => s + d.quantidade, 0)
                  return (
                    <div key={c.categoria} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full shrink-0" style={{ background: PIE_COLORS[i] }} />
                        <span className="text-xs text-foreground">{c.categoria}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{((c.quantidade / total) * 100).toFixed(1)}%</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top produtos */}
          <Card className="border-border/60 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Top 5 Produtos mais Vendidos</CardTitle>
              <CardDescription className="text-xs">Ranking por quantidade de saídas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/60 hover:bg-transparent">
                    <TableHead className="text-xs w-8">#</TableHead>
                    <TableHead className="text-xs">Produto</TableHead>
                    <TableHead className="text-xs">Categoria</TableHead>
                    <TableHead className="text-xs text-right">Vendas</TableHead>
                    <TableHead className="text-xs text-right">Receita</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProductos.map((p, i) => (
                    <TableRow key={p.id} className="border-border/40 hover:bg-muted/30">
                      <TableCell className="py-3">
                        <div className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? "bg-yellow-100 text-yellow-700" : i === 1 ? "bg-gray-100 text-gray-600" : i === 2 ? "bg-orange-100 text-orange-600" : "bg-muted text-muted-foreground"}`}>
                          {i + 1}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-sm font-medium text-foreground">{p.nome}</TableCell>
                      <TableCell className="py-3">
                        <Badge variant="outline" className="text-xs">{p.categoriaNome}</Badge>
                      </TableCell>
                      <TableCell className="py-3 text-right text-sm font-semibold text-foreground">{p.totalSaidas}</TableCell>
                      <TableCell className="py-3 text-right text-sm font-semibold text-green-600">
                        R$ {p.receita.toFixed(2).replace(".", ",")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total geral de vendas</p>
                  <p className="text-xl font-bold text-foreground">
                    {stockExits.reduce((a, e) => a + e.quantidade, 0)} unidades
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Receita total</p>
                  <p className="text-xl font-bold text-green-600">
                    R$ {stockExits.reduce((a, e) => a + e.valorTotal, 0).toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
