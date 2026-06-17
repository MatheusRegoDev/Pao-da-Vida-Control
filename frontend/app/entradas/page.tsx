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
import { Plus, Search, ArrowDownCircle, Package, ClipboardList } from "lucide-react"
import { stockEntries as initialEntries, products, type StockEntry } from "@/lib/data"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const responsaveis = ["Carlos Silva", "Ana Lima", "Maria Santos", "João Pereira", "Luísa Andrade"]

export default function EntradasPage() {
  const [entries, setEntries] = useState<StockEntry[]>(initialEntries)
  const [search, setSearch] = useState("")
  const [filterProduct, setFilterProduct] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({
    produtoId: "", quantidade: "", observacao: "", responsavel: "",
  })

  const filtered = entries
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
    const newEntry: StockEntry = {
      id: Math.max(...entries.map(e => e.id)) + 1,
      produtoId: Number(form.produtoId),
      produtoNome: produto?.nome ?? "",
      quantidade: Number(form.quantidade),
      data: new Date().toISOString(),
      observacao: form.observacao,
      responsavel: form.responsavel,
    }
    setEntries(prev => [newEntry, ...prev])
    setForm({ produtoId: "", quantidade: "", observacao: "", responsavel: "" })
    setDialogOpen(false)
  }

  const totalHoje = entries
    .filter(e => e.data.startsWith(new Date().toISOString().split("T")[0]))
    .reduce((acc, e) => acc + e.quantidade, 0)

  const totalMes = entries
    .filter(e => e.data.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((acc, e) => acc + e.quantidade, 0)

  const registrosHoje = entries.filter(e => e.data.startsWith(new Date().toISOString().split("T")[0])).length

  return (
    <AppLayout title="Entrada de Produção" description="Registre os produtos confeccionados na padaria">
      <div className="flex flex-col gap-6">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Unidades Hoje", value: totalHoje, icon: ArrowDownCircle, color: "text-green-600", bg: "bg-green-50" },
            { label: "Registros Hoje", value: registrosHoje, icon: ClipboardList, color: "text-primary", bg: "bg-primary/10" },
            { label: "Unidades no Mês", value: totalMes.toLocaleString("pt-BR"), icon: Package, color: "text-chart-2", bg: "bg-chart-2/10" },
            { label: "Total de Registros", value: entries.length, icon: ClipboardList, color: "text-muted-foreground", bg: "bg-muted" },
          ].map(s => (
            <Card key={s.label} className="border-border/60">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <div className={`flex size-6 items-center justify-center rounded-md ${s.bg}`}>
                    <s.icon className={`size-3 ${s.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters & Action */}
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
            Registrar Entrada
          </Button>
        </div>

        {/* Table */}
        <Card className="border-border/60">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-semibold">Histórico de Entradas</CardTitle>
            <CardDescription className="text-xs">{filtered.length} registro(s) encontrado(s)</CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="text-xs pl-6">Produto</TableHead>
                  <TableHead className="text-xs text-center">Quantidade</TableHead>
                  <TableHead className="text-xs">Responsável</TableHead>
                  <TableHead className="text-xs">Observação</TableHead>
                  <TableHead className="text-xs text-right pr-6">Data / Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                      <ArrowDownCircle className="size-8 mx-auto mb-2 opacity-30" />
                      <p>Nenhuma entrada encontrada</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map(entry => (
                    <TableRow key={entry.id} className="border-border/40 hover:bg-muted/40">
                      <TableCell className="pl-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex size-7 items-center justify-center rounded-md bg-green-50">
                            <ArrowDownCircle className="size-3.5 text-green-600" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{entry.produtoNome}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-center">
                        <Badge className="bg-green-50 text-green-700 border-green-200 text-xs font-semibold">
                          +{entry.quantidade} unid.
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-xs text-foreground">{entry.responsavel}</TableCell>
                      <TableCell className="py-3 text-xs text-muted-foreground max-w-xs truncate">
                        {entry.observacao || "—"}
                      </TableCell>
                      <TableCell className="py-3 pr-6 text-right text-xs text-muted-foreground">
                        {format(new Date(entry.data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
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
            <DialogTitle>Registrar Entrada de Produção</DialogTitle>
            <DialogDescription className="text-xs">Registre os produtos produzidos na padaria hoje.</DialogDescription>
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
                      {p.nome} <span className="text-muted-foreground">({p.unidade})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Quantidade Produzida <span className="text-destructive">*</span></Label>
              <Input type="number" min="1" placeholder="0" value={form.quantidade} onChange={e => setForm(f => ({ ...f, quantidade: e.target.value }))} className="h-9 text-sm" />
            </div>
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
              <Textarea placeholder="Ex: Produção matinal, lote especial..." value={form.observacao} onChange={e => setForm(f => ({ ...f, observacao: e.target.value }))} className="text-sm resize-none" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button size="sm" onClick={handleSave} disabled={!form.produtoId || !form.quantidade || !form.responsavel}>
              Registrar Entrada
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
