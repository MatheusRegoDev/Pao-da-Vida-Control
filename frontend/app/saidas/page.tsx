"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, ArrowUpCircle, DollarSign, TrendingUp, ShoppingCart } from "lucide-react"
import { stockExits as initialExits, products, type StockExit } from "@/lib/data"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const responsaveis = ["Carlos Silva", "Ana Lima", "Maria Santos", "João Pereira", "Luísa Andrade"]

export default function SaidasPage() {
  const [exits, setExits] = useState<StockExit[]>(initialExits)
  const [search, setSearch] = useState("")
  const [filterProduct, setFilterProduct] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({
    produtoId: "", quantidade: "", observacao: "", responsavel: "",
  })

  const selectedProduct = products.find(p => p.id === Number(form.produtoId))
  const previewTotal = selectedProduct && form.quantidade
    ? (selectedProduct.precoVenda * Number(form.quantidade)).toFixed(2).replace(".", ",")
    : null

  const filtered = exits
    .filter(e => {
      const matchSearch = e.produtoNome.toLowerCase().includes(search.toLowerCase()) ||
        e.responsavel.toLowerCase().includes(search.toLowerCase())
      const matchProd = filterProduct === "all" || String(e.produtoId) === filterProduct
      return matchSearch && matchProd
    })
    .sort((a, b) => b.data.localeCompare(a.data))

  function handleSave() {
    if (!form.produtoId || !form.quantidade || !form.responsavel) return
    const produto = products.find(p => p.id === Number(form.produtoId))
    if (!produto) return
    const qty = Number(form.quantidade)
    const newExit: StockExit = {
      id: Math.max(...exits.map(e => e.id)) + 1,
      produtoId: produto.id,
      produtoNome: produto.nome,
      quantidade: qty,
      valorUnitario: produto.precoVenda,
      valorTotal: produto.precoVenda * qty,
      data: new Date().toISOString(),
      observacao: form.observacao,
      responsavel: form.responsavel,
    }
    setExits(prev => [newExit, ...prev])
    setForm({ produtoId: "", quantidade: "", observacao: "", responsavel: "" })
    setDialogOpen(false)
  }

  const todayStr = new Date().toISOString().split("T")[0]
  const mesStr = new Date().toISOString().slice(0, 7)

  const receitaHoje = exits.filter(e => e.data.startsWith(todayStr)).reduce((a, e) => a + e.valorTotal, 0)
  const unidadesHoje = exits.filter(e => e.data.startsWith(todayStr)).reduce((a, e) => a + e.quantidade, 0)
  const receitaMes = exits.filter(e => e.data.startsWith(mesStr)).reduce((a, e) => a + e.valorTotal, 0)
  const ticketMedio = exits.length > 0 ? exits.reduce((a, e) => a + e.valorTotal, 0) / exits.length : 0

  return (
    <AppLayout title="Saída de Vendas" description="Registre as vendas e saídas de produtos do estoque">
      <div className="flex flex-col gap-6">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Receita Hoje", value: `R$ ${receitaHoje.toFixed(2).replace(".", ",")}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
            { label: "Unidades Vendidas Hoje", value: unidadesHoje, icon: ShoppingCart, color: "text-primary", bg: "bg-primary/10" },
            { label: "Receita do Mês", value: `R$ ${receitaMes.toFixed(2).replace(".", ",")}`, icon: TrendingUp, color: "text-chart-2", bg: "bg-chart-2/10" },
            { label: "Ticket Médio", value: `R$ ${ticketMedio.toFixed(2).replace(".", ",")}`, icon: ArrowUpCircle, color: "text-muted-foreground", bg: "bg-muted" },
          ].map(s => (
            <Card key={s.label} className="border-border/60">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <div className={`flex size-6 items-center justify-center rounded-md ${s.bg}`}>
                    <s.icon className={`size-3 ${s.color}`} />
                  </div>
                </div>
                <p className="text-xl font-bold text-foreground truncate">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm w-52" />
            </div>
            <Select value={filterProduct} onValueChange={setFilterProduct}>
              <SelectTrigger className="h-9 text-sm w-48">
                <SelectValue placeholder="Produto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os produtos</SelectItem>
                {products.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setDialogOpen(true)} size="sm" className="gap-2">
            <Plus data-icon="inline-start" className="size-4" />
            Registrar Venda
          </Button>
        </div>

        {/* Table */}
        <Card className="border-border/60">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-semibold">Histórico de Vendas</CardTitle>
            <CardDescription className="text-xs">{filtered.length} venda(s) encontrada(s)</CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="text-xs pl-6">Produto</TableHead>
                  <TableHead className="text-xs text-center">Quantidade</TableHead>
                  <TableHead className="text-xs text-right">Valor Unit.</TableHead>
                  <TableHead className="text-xs text-right">Total</TableHead>
                  <TableHead className="text-xs">Responsável</TableHead>
                  <TableHead className="text-xs">Observação</TableHead>
                  <TableHead className="text-xs text-right pr-6">Data / Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                      <ShoppingCart className="size-8 mx-auto mb-2 opacity-30" />
                      <p>Nenhuma venda encontrada</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map(exit => (
                    <TableRow key={exit.id} className="border-border/40 hover:bg-muted/40">
                      <TableCell className="pl-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex size-7 items-center justify-center rounded-md bg-blue-50">
                            <ArrowUpCircle className="size-3.5 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{exit.produtoNome}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-center">
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-semibold">
                          -{exit.quantidade} unid.
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-right text-xs text-muted-foreground">
                        R$ {exit.valorUnitario.toFixed(2).replace(".", ",")}
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <span className="text-sm font-semibold text-foreground">
                          R$ {exit.valorTotal.toFixed(2).replace(".", ",")}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 text-xs text-foreground">{exit.responsavel}</TableCell>
                      <TableCell className="py-3 text-xs text-muted-foreground max-w-[150px] truncate">
                        {exit.observacao || "—"}
                      </TableCell>
                      <TableCell className="py-3 pr-6 text-right text-xs text-muted-foreground">
                        {format(new Date(exit.data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Venda</DialogTitle>
            <DialogDescription className="text-xs">Registre a saída de produtos por venda.</DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Produto <span className="text-destructive">*</span></Label>
              <Select value={form.produtoId} onValueChange={v => setForm(f => ({ ...f, produtoId: v }))}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Selecione o produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(p => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.nome} — R$ {p.precoVenda.toFixed(2).replace(".", ",")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Quantidade <span className="text-destructive">*</span></Label>
              <Input type="number" min="1" placeholder="0" value={form.quantidade} onChange={e => setForm(f => ({ ...f, quantidade: e.target.value }))} className="h-9 text-sm" />
            </div>
            {previewTotal && (
              <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-green-700 font-medium">Total da venda</span>
                <span className="text-lg font-bold text-green-700">R$ {previewTotal}</span>
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Responsável <span className="text-destructive">*</span></Label>
              <Select value={form.responsavel} onValueChange={v => setForm(f => ({ ...f, responsavel: v }))}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Selecione o responsável" />
                </SelectTrigger>
                <SelectContent>
                  {responsaveis.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Observação</Label>
              <Textarea placeholder="Ex: Venda balcão, encomenda..." value={form.observacao} onChange={e => setForm(f => ({ ...f, observacao: e.target.value }))} className="text-sm resize-none" rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button size="sm" onClick={handleSave} disabled={!form.produtoId || !form.quantidade || !form.responsavel}>
              Confirmar Venda
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
