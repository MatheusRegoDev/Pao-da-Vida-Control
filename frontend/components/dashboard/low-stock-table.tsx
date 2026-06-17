"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle } from "lucide-react"
import { products } from "@/lib/data"

export function LowStockTable() {
  const lowStock = products
    .filter(p => p.estoque < p.estoqueMinimo)
    .sort((a, b) => (a.estoque / a.estoqueMinimo) - (b.estoque / b.estoqueMinimo))

  const recentExits = products
    .filter(p => p.estoque >= p.estoqueMinimo)
    .slice(0, 3)

  return (
    <Card className="border-border/60">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-destructive" />
          <div>
            <CardTitle className="text-sm font-semibold">Alertas de Estoque</CardTitle>
            <CardDescription className="text-xs">Produtos abaixo do nível mínimo</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="text-xs pl-6">Produto</TableHead>
              <TableHead className="text-xs">Categoria</TableHead>
              <TableHead className="text-xs text-right">Atual</TableHead>
              <TableHead className="text-xs text-right">Mínimo</TableHead>
              <TableHead className="text-xs w-32">Nível</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lowStock.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-sm text-muted-foreground">
                  Nenhum produto com estoque crítico
                </TableCell>
              </TableRow>
            ) : (
              lowStock.map(product => {
                const pct = Math.min((product.estoque / product.estoqueMinimo) * 100, 100)
                const isCritical = pct < 40
                return (
                  <TableRow key={product.id} className="border-border/40">
                    <TableCell className="pl-6 py-3">
                      <p className="text-xs font-medium text-foreground">{product.nome}</p>
                      <p className="text-xs text-muted-foreground">{product.unidade}</p>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge variant="outline" className="text-xs">{product.categoriaNome}</Badge>
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <span className={`text-xs font-semibold ${isCritical ? 'text-destructive' : 'text-yellow-600'}`}>
                        {product.estoque}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 text-right text-xs text-muted-foreground">
                      {product.estoqueMinimo}
                    </TableCell>
                    <TableCell className="py-3 pr-6">
                      <div className="flex items-center gap-2">
                        <Progress value={pct} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground w-8 text-right">{pct.toFixed(0)}%</span>
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
