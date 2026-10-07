"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, BarChart3, Package, DollarSign, Loader2 } from "lucide-react"

import { relatorioService } from "@/services/relatorio.service"
import type {
  RelatorioResumoDto,
  RelatorioGraficoDto,
  CategoriaVendaDto,
  TopProdutosDto,
  PeriodoRelatorio,
} from "@/lib/types"

const prodVendasConfig = {
  producao: { label: "Produção", color: "var(--chart-1)" },
  vendas: { label: "Vendas", color: "var(--chart-2)" },
}

const receitaConfig = {
  receita: { label: "Receita (R$)", color: "var(--chart-1)" },
}

const PIE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "oklch(0.72 0.06 60)",
]

export default function RelatoriosPage() {
  const [periodo, setPeriodo] = useState<PeriodoRelatorio>("DIARIO")
  const [resumo, setResumo] = useState<RelatorioResumoDto | null>(null)
  const [grafico, setGrafico] = useState<RelatorioGraficoDto | null>(null)
  const [categorias, setCategorias] = useState<CategoriaVendaDto[]>([])
  const [topProdutos, setTopProdutos] = useState<TopProdutosDto[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregarRelatorios() {
      setLoading(true)
      setErro(null)

      // allSettled: se UM endpoint falhar, os outros continuam renderizando
      const [resumoRes, graficoRes, categoriasRes, topProdRes] = await Promise.allSettled([
        relatorioService.resumo(),
        relatorioService.grafico(periodo),
        relatorioService.vendasPorCategoria(),
        relatorioService.topProdutos(),
      ])

      if (resumoRes.status === "fulfilled") setResumo(resumoRes.value)
      if (graficoRes.status === "fulfilled") setGrafico(graficoRes.value)
      if (categoriasRes.status === "fulfilled") setCategorias(categoriasRes.value || [])
      if (topProdRes.status === "fulfilled") setTopProdutos(topProdRes.value || [])

      const falhas = [resumoRes, graficoRes, categoriasRes, topProdRes].filter(
        r => r.status === "rejected"
      )
      if (falhas.length > 0) {
        console.error("Falhas ao carregar relatórios:", falhas)
        const motivo = (falhas[0] as PromiseRejectedResult).reason
        setErro(
          falhas.length === 4
            ? motivo instanceof Error
              ? motivo.message
              : "Não foi possível carregar os relatórios."
            : "Alguns gráficos não puderam ser carregados."
        )
      }

      setLoading(false)
    }
    carregarRelatorios()
  }, [periodo])

  const topProdConfig = Object.fromEntries(
    categorias.map((c, i) => [
      c.categoria.toLowerCase().replace(/\s/g, "_"),
      { label: c.categoria, color: PIE_COLORS[i % PIE_COLORS.length] },
    ])
  )

  const totalVendasGeral = topProdutos.reduce((a, p) => a + (p.vendas || 0), 0)
  const totalReceitaGeral = topProdutos.reduce((a, p) => a + (p.receita || 0), 0)

  return (
    <AppLayout title="Gráficos e Análises" description="Relatórios de produção e vendas por período">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Erro parcial/total */}
        {erro && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {erro}
          </div>
        )}

        {/* KPI cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {[
            {
              label: "Produção no Período",
              value: (resumo?.producaoPeriodo ?? 0).toLocaleString("pt-BR"),
              sub: "unidades confeccionadas",
              icon: Package,
              color: "text-chart-1",
              bg: "bg-chart-1/10",
            },
            {
              label: "Vendas no Período",
              value: (resumo?.vendaPeriodo ?? 0).toLocaleString("pt-BR"),
              sub: "unidades vendidas",
              icon: TrendingUp,
              color: "text-chart-2",
              bg: "bg-chart-2/10",
            },
            {
              label: "Receita no Período",
              value: `R$ ${(resumo?.receitaPeriodo ?? 0).toFixed(2).replace(".", ",")}`,
              sub: "faturamento total",
              icon: DollarSign,
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              label: "Taxa de Aproveitamento",
              value: `${(resumo?.aproveitamentoPercentual ?? 0).toFixed(1)}%`,
              sub: "produção comercializada",
              icon: BarChart3,
              color: "text-primary",
              bg: "bg-primary/10",
            },
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
          <Tabs
            value={periodo}
            onValueChange={v => setPeriodo(v as PeriodoRelatorio)}
            className="w-fit"
          >
            <TabsList>
              <TabsTrigger value="DIARIO" className="text-xs px-4">
                Análise Diária
              </TabsTrigger>
              <TabsTrigger value="SEMANAL" className="text-xs px-4">
                Análise Semanal
              </TabsTrigger>
              <TabsTrigger value="MENSAL" className="text-xs px-4">
                Análise Mensal
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Main charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Produção vs Vendas */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Produção vs Vendas</CardTitle>
              <CardDescription className="text-xs">
                Comparativo de unidades produzidas e vendidas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[260px] flex items-center justify-center text-xs text-muted-foreground">
                  <Loader2 className="size-5 animate-spin mr-2 opacity-50" />
                  Carregando comparativo...
                </div>
              ) : !grafico?.producaoVendas || grafico.producaoVendas.length === 0 ? (
                <div className="h-[260px] flex items-center justify-center text-xs text-muted-foreground">
                  Sem dados registrados para este período.
                </div>
              ) : (
                <ChartContainer config={prodVendasConfig} className="h-[260px] w-full">
                  <BarChart data={grafico.producaoVendas} barGap={4}>
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
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar
                      dataKey="producao"
                      fill="var(--color-producao)"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={36}
                    />
                    <Bar
                      dataKey="vendas"
                      fill="var(--color-vendas)"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={36}
                    />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          {/* Receita */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Evolução da Receita</CardTitle>
              <CardDescription className="text-xs">
                Faturamento apurado no período em R$
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[260px] flex items-center justify-center text-xs text-muted-foreground">
                  <Loader2 className="size-5 animate-spin mr-2 opacity-50" />
                  Carregando receita...
                </div>
              ) : !grafico?.receita || grafico.receita.length === 0 ? (
                <div className="h-[260px] flex items-center justify-center text-xs text-muted-foreground">
                  Sem dados de receita registrados para este período.
                </div>
              ) : (
                <ChartContainer config={receitaConfig} className="h-[260px] w-full">
                  <AreaChart data={grafico.receita}>
                    <defs>
                      <linearGradient id="recGrad2" x1="0" y1="0" x2="0" y2="1">
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
                      width={60}
                      tickFormatter={v => `R$${v}`}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={v => `R$ ${Number(v).toFixed(2).replace(".", ",")}`}
                        />
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="receita"
                      stroke="var(--color-receita)"
                      strokeWidth={2}
                      fill="url(#recGrad2)"
                      dot={{ r: 3, fill: "var(--color-receita)", strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ChartContainer>
              )}
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
              {loading ? (
                <div className="h-[180px] flex items-center justify-center text-xs text-muted-foreground">
                  <Loader2 className="size-5 animate-spin mr-2 opacity-50" />
                  Carregando...
                </div>
              ) : categorias.length === 0 ? (
                <div className="h-[180px] flex items-center justify-center text-xs text-muted-foreground">
                  Sem vendas registradas por categoria.
                </div>
              ) : (
                <>
                  <ChartContainer config={topProdConfig} className="h-[180px] w-full">
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent nameKey="categoria" />} />
                      <Pie
                        data={categorias}
                        dataKey="quantidade"
                        nameKey="categoria"
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={75}
                        strokeWidth={2}
                        stroke="var(--card)"
                      >
                        {categorias.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                  <div className="mt-3 flex flex-col gap-1.5">
                    {categorias.map((c, i) => (
                      <div key={c.categoria} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="size-2 rounded-full shrink-0"
                            style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                          />
                          <span className="text-xs text-foreground">{c.categoria}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{c.percentual}%</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Top produtos */}
          <Card className="border-border/60 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Top Produtos mais Vendidos</CardTitle>
              <CardDescription className="text-xs">
                Ranking consolidado pelo backend por quantidade de saídas
              </CardDescription>
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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-xs text-muted-foreground">
                        <Loader2 className="size-5 animate-spin mx-auto mb-1 opacity-50" />
                        Carregando ranking...
                      </TableCell>
                    </TableRow>
                  ) : topProdutos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-xs text-muted-foreground">
                        Nenhum produto vendido ainda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    topProdutos.map((p, i) => (
                      <TableRow key={p.produto} className="border-border/40 hover:bg-muted/30">
                        <TableCell className="py-3">
                          <div
                            className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
                              i === 0
                                ? "bg-yellow-100 text-yellow-700"
                                : i === 1
                                  ? "bg-gray-100 text-gray-600"
                                  : i === 2
                                    ? "bg-orange-100 text-orange-600"
                                    : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {i + 1}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-sm font-medium text-foreground">
                          {p.produto}
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge variant="outline" className="text-xs">
                            {p.categoria}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-right text-sm font-semibold text-foreground">
                          {p.vendas}
                        </TableCell>
                        <TableCell className="py-3 text-right text-sm font-semibold text-green-600">
                          R$ {(p.receita || 0).toFixed(2).replace(".", ",")}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total de unidades vendidas</p>
                  <p className="text-xl font-bold text-foreground">{totalVendasGeral} unidades</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Receita do ranking</p>
                  <p className="text-xl font-bold text-green-600">
                    R$ {totalReceitaGeral.toFixed(2).replace(".", ",")}
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
