"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, ShoppingBag, ArrowUpCircle, ArrowDownCircle, Loader2 } from "lucide-react"
import { dashboardService } from "@/services/dashboard.service"
import type { ResumoDto } from "@/lib/types"

export function StatsCards() {
  const [resumo, setResumo] = useState<ResumoDto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await dashboardService.resumo()
        setResumo(data)
      } catch (err) {
        console.error("Erro ao carregar estatísticas do dashboard:", err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const cards = [
    {
      title: "Total de Produtos",
      value: resumo?.totalProdutos ?? 0,
      suffix: "cadastrados",
      icon: Package,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Estoque Total",
      value: (resumo?.estoqueTotal ?? 0).toLocaleString("pt-BR"),
      suffix: "unidades em estoque",
      icon: ShoppingBag,
      color: "text-chart-2",
      bg: "bg-chart-2/10",
    },
    {
      title: "Produção Hoje",
      value: resumo?.producaoHoje ?? 0,
      suffix: "unidades produzidas",
      icon: ArrowDownCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Vendas Hoje",
      value: resumo?.vendasHoje ?? 0,
      suffix: `R$ ${(resumo?.receitaHoje ?? 0).toFixed(2).replace(".", ",")}`,
      icon: ArrowUpCircle,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Estoque Baixo",
      value: resumo?.estoqueCritico ?? 0,
      suffix: "produtos críticos",
      icon: AlertTriangle,
      color: (resumo?.estoqueCritico ?? 0) > 0 ? "text-destructive" : "text-muted-foreground",
      bg: (resumo?.estoqueCritico ?? 0) > 0 ? "bg-destructive/10" : "bg-muted",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
      {cards.map(card => (
        <Card key={card.title} className="border-border/60">
          <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-medium text-muted-foreground">{card.title}</CardTitle>
              <div className={`flex size-7 items-center justify-center rounded-md ${card.bg}`}>
                <card.icon className={`size-3.5 ${card.color}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            {loading ? (
              <div className="flex items-center gap-1.5 py-1">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Atualizando...</span>
              </div>
            ) : (
              <>
                <p className="text-xl font-bold text-foreground sm:text-2xl">{card.value}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{card.suffix}</p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
