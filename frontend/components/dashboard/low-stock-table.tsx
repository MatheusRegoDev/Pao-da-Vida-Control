"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Loader2 } from "lucide-react"
import { produtoService } from "@/services/produto.service"
import type { ProdutoResponseDto } from "@/lib/types"

export function LowStockTable() {
  const [lowStock, setLowStock] = useState<ProdutoResponseDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregarCriticos() {
      try {
        const res = await produtoService.listar({ estoqueCritico: true, size: 5 })
        setLowStock(res.content || [])
      } catch (err) {
        console.error("Erro ao carregar alertas de estoque:", err)
      } finally {
        setLoading(false)
      }
    }
    carregarCriticos()
  }, [])

  return (
    <Card className="min-w-0 overflow-hidden border-border/60">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-destructive" />
          <div>
            <CardTitle className="text-sm font-semibold">Alertas de Estoque</CardTitle>
            <CardDescription className="text-xs">Produtos abaixo do nível mínimo de segurança</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="text-xs pl-6">Produto</TableHead>
              <TableHead className="hidden text-xs sm:table-cell">Categoria</TableHead>
              <TableHead className="text-xs text-right">Atual</TableHead>
              <TableHead className="text-xs text-right">Mínimo</TableHead>
              <TableHead className="hidden w-32 text-xs sm:table-cell">Nível</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-sm text-muted-foreground">
                  <Loader2 className="size-5 animate-spin mx-auto mb-1 opacity-50" />
                  Carregando alertas...
                </TableCell>
              </TableRow>
            ) : lowStock.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-sm text-muted-foreground">
                  Nenhum produto com estoque crítico
                </TableCell>
              </TableRow>
            ) : (
              lowStock.map(product => {
                const max = product.estoqueMinimo > 0 ? product.estoqueMinimo : 1
                const pct = Math.min((product.estoque / max) * 100, 100)
                const isCritical = pct < 40
                return (
                  <TableRow key={product.id} className="border-border/40">
                    <TableCell className="pl-6 py-3">
                      <p className="text-xs font-medium text-foreground">{product.nome}</p>
                      <p className="text-xs text-muted-foreground">{product.unidade}</p>
                    </TableCell>
                    <TableCell className="hidden py-3 sm:table-cell">
                      <Badge variant="outline" className="text-xs">
                        {product.categoriaNome}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <span className="text-xs font-semibold text-destructive">{product.estoque}</span>
                    </TableCell>
                    <TableCell className="py-3 text-right text-xs text-muted-foreground">
                      {product.estoqueMinimo}
                    </TableCell>
                    <TableCell className="hidden py-3 sm:table-cell">
                      <div className="flex items-center gap-2">
                        <Progress
                          value={pct}
                          className="h-1.5 flex-1"
                        />
                        <span
                          className={`text-xs font-medium w-8 text-right ${
                            isCritical ? "text-destructive" : "text-chart-5"
                          }`}
                        >
                          {Math.round(pct)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
