"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, TrendingUp, TrendingDown, AlertTriangle, ShoppingBag, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { products, stockEntries, stockExits } from "@/lib/data"

export function StatsCards() {
  const totalProdutos = products.length
  const produtosBaixoEstoque = products.filter(p => p.estoque < p.estoqueMinimo).length
  const totalEstoque = products.reduce((acc, p) => acc + p.estoque, 0)

  const today = new Date().toISOString().split('T')[0]
  const entradasHoje = stockEntries
    .filter(e => e.data.startsWith(today))
    .reduce((acc, e) => acc + e.quantidade, 0)
  const saidasHoje = stockExits
    .filter(s => s.data.startsWith(today))
    .reduce((acc, s) => acc + s.quantidade, 0)
  const receitaHoje = stockExits
    .filter(s => s.data.startsWith(today))
    .reduce((acc, s) => acc + s.valorTotal, 0)

  const cards = [
    {
      title: "Total de Produtos",
      value: totalProdutos,
      suffix: "cadastrados",
      icon: Package,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Estoque Total",
      value: totalEstoque.toLocaleString('pt-BR'),
      suffix: "unidades",
      icon: ShoppingBag,
      color: "text-chart-2",
      bg: "bg-chart-2/10",
    },
    {
      title: "Produção Hoje",
      value: entradasHoje,
      suffix: "unidades produzidas",
      icon: ArrowDownCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Vendas Hoje",
      value: saidasHoje,
      suffix: `R$ ${receitaHoje.toFixed(2).replace('.', ',')}`,
      icon: ArrowUpCircle,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Estoque Baixo",
      value: produtosBaixoEstoque,
      suffix: "produtos críticos",
      icon: AlertTriangle,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.title} className="border-border/60">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-medium text-muted-foreground">{card.title}</CardTitle>
              <div className={`flex size-7 items-center justify-center rounded-md ${card.bg}`}>
                <card.icon className={`size-3.5 ${card.color}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{card.suffix}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
