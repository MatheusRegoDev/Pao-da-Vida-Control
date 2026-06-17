"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Plus, Pencil, Trash2, Search, Package, AlertTriangle } from "lucide-react"
import { products as initialProducts, categories, type Product } from "@/lib/data"

const unidades = ["unid", "kg", "g", "L", "mL", "fatia", "dúzia", "caixa", "bandeja"]

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState({
    nome: "", categoriaId: "", unidade: "unid",
    precoVenda: "", estoque: "", estoqueMinimo: "",
  })

  const filtered = products.filter(p => {
    const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCategory === "all" || String(p.categoriaId) === filterCategory
    const matchStatus = filterStatus === "all"
      || (filterStatus === "baixo" && p.estoque < p.estoqueMinimo)
      || (filterStatus === "ok" && p.estoque >= p.estoqueMinimo)
    return matchSearch && matchCat && matchStatus
  })

  function openNew() {
    setEditing(null)
    setForm({ nome: "", categoriaId: "", unidade: "unid", precoVenda: "", estoque: "", estoqueMinimo: "" })
    setDialogOpen(true)
  }

  function openEdit(p: Product) {
    setEditing(p)
    setForm({
      nome: p.nome,
      categoriaId: String(p.categoriaId),
      unidade: p.unidade,
      precoVenda: String(p.precoVenda),
      estoque: String(p.estoque),
      estoqueMinimo: String(p.estoqueMinimo),
    })
    setDialogOpen(true)
  }

  function handleSave() {
    if (!form.nome.trim() || !form.categoriaId) return
    const cat = categories.find(c => c.id === Number(form.categoriaId))
    if (editing) {
      setProducts(prev => prev.map(p => p.id === editing.id ? {
        ...p,
        nome: form.nome,
        categoriaId: Number(form.categoriaId),
        categoriaNome: cat?.nome ?? "",
        unidade: form.unidade,
        precoVenda: Number(form.precoVenda),
        estoque: Number(form.estoque),
        estoqueMinimo: Number(form.estoqueMinimo),
      } : p))
    } else {
      const newP: Product = {
        id: Math.max(...products.map(p => p.id)) + 1,
        nome: form.nome,
        categoriaId: Number(form.categoriaId),
        categoriaNome: cat?.nome ?? "",
        unidade: form.unidade,
        precoVenda: Number(form.precoVenda),
        estoque: Number(form.estoque),
        estoqueMinimo: Number(form.estoqueMinimo),
        criadoEm: new Date().toISOString().split("T")[0],
      }
      setProducts(prev => [...prev, newP])
    }
    setDialogOpen(false)
  }

  function handleDelete() {
    if (deleteId !== null) {
      setProducts(prev => prev.filter(p => p.id !== deleteId))
      setDeleteId(null)
    }
  }

  const lowStockCount = products.filter(p => p.estoque < p.estoqueMinimo).length

  return (
    <AppLayout title="Produtos" description="Gerencie o catálogo de produtos da padaria">
      <div className="flex flex-col gap-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input placeholder="Buscar produtos..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm w-56" />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="h-9 text-sm w-44">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.nome}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-9 text-sm w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ok">Estoque OK</SelectItem>
                <SelectItem value="baixo">Estoque Baixo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={openNew} size="sm" className="gap-2">
            <Plus data-icon="inline-start" className="size-4" />
            Novo Produto
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total de Produtos", value: products.length, color: "" },
            { label: "Categorias Ativas", value: new Set(products.map(p => p.categoriaId)).size, color: "" },
            { label: "Valor Total Estoque", value: `R$ ${products.reduce((a, p) => a + p.estoque * p.precoVenda, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, color: "" },
            { label: "Estoque Crítico", value: lowStockCount, color: lowStockCount > 0 ? "text-destructive" : "" },
          ].map(s => (
            <Card key={s.label} className="border-border/60">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={`mt-1 text-lg font-bold text-foreground truncate ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card className="border-border/60">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-semibold">Catálogo de Produtos</CardTitle>
            <CardDescription className="text-xs">{filtered.length} produto(s) encontrado(s)</CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="text-xs pl-6">Produto</TableHead>
                  <TableHead className="text-xs">Categoria</TableHead>
                  <TableHead className="text-xs text-right">Preço</TableHead>
                  <TableHead className="text-xs text-right">Estoque</TableHead>
                  <TableHead className="text-xs w-40">Nível de Estoque</TableHead>
                  <TableHead className="text-xs text-right pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                      <Package className="size-8 mx-auto mb-2 opacity-30" />
                      <p>Nenhum produto encontrado</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map(product => {
                    const pct = Math.min((product.estoque / product.estoqueMinimo) * 100, 100)
                    const isLow = product.estoque < product.estoqueMinimo
                    return (
                      <TableRow key={product.id} className="border-border/40 hover:bg-muted/40">
                        <TableCell className="pl-6 py-3">
                          <div className="flex items-center gap-2">
                            {isLow && <AlertTriangle className="size-3.5 text-destructive shrink-0" />}
                            <div>
                              <p className="text-sm font-medium text-foreground">{product.nome}</p>
                              <p className="text-xs text-muted-foreground">{product.unidade}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge variant="outline" className="text-xs">{product.categoriaNome}</Badge>
                        </TableCell>
                        <TableCell className="py-3 text-right text-sm font-medium text-foreground">
                          R$ {product.precoVenda.toFixed(2).replace(".", ",")}
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <span className={`text-sm font-semibold ${isLow ? "text-destructive" : "text-foreground"}`}>
                            {product.estoque}
                          </span>
                          <span className="text-xs text-muted-foreground"> / {product.estoqueMinimo}</span>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="flex items-center gap-2">
                            <Progress value={pct} className="h-1.5 flex-1" />
                            <span className="text-xs text-muted-foreground w-7 text-right">{Math.round(pct)}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 pr-6">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" className="size-8 p-0" onClick={() => openEdit(product)}>
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="size-8 p-0 text-destructive hover:text-destructive" onClick={() => setDeleteId(product.id)}>
                              <Trash2 className="size-3.5" />
                            </Button>
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
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Produto" : "Novo Produto"}</DialogTitle>
            <DialogDescription className="text-xs">Preencha as informações do produto.</DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Nome <span className="text-destructive">*</span></Label>
              <Input placeholder="Ex: Pão Francês" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} className="h-9 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Categoria <span className="text-destructive">*</span></Label>
              <Select value={form.categoriaId} onValueChange={v => setForm(f => ({ ...f, categoriaId: v }))}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Unidade</Label>
              <Select value={form.unidade} onValueChange={v => setForm(f => ({ ...f, unidade: v }))}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {unidades.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Preço de Venda (R$)</Label>
              <Input type="number" step="0.01" placeholder="0,00" value={form.precoVenda} onChange={e => setForm(f => ({ ...f, precoVenda: e.target.value }))} className="h-9 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Estoque Atual</Label>
              <Input type="number" placeholder="0" value={form.estoque} onChange={e => setForm(f => ({ ...f, estoque: e.target.value }))} className="h-9 text-sm" />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Estoque Mínimo</Label>
              <Input type="number" placeholder="0" value={form.estoqueMinimo} onChange={e => setForm(f => ({ ...f, estoqueMinimo: e.target.value }))} className="h-9 text-sm" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button size="sm" onClick={handleSave} disabled={!form.nome.trim() || !form.categoriaId}>
              {editing ? "Salvar Alterações" : "Criar Produto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <AlertDialog open={deleteId !== null} onOpenChange={o => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação removerá o produto permanentemente do sistema.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  )
}
