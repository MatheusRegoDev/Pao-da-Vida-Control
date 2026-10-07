"use client"

import { useState, useEffect, useCallback } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, ArrowUpCircle, DollarSign, TrendingUp, ShoppingCart, Pencil, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { saidaService } from "@/services/saida.service"
import { produtoService } from "@/services/produto.service"
import type { SaidaResponseDto, ProdutoResponseDto } from "@/lib/types"

export default function SaidasPage() {
  const [exits, setExits] = useState<SaidaResponseDto[]>([])
  const [products, setProducts] = useState<ProdutoResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [search, setSearch] = useState("")
  const [filterProduct, setFilterProduct] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({
    produtoId: "",
    quantidade: "",
    observacao: "",
  })

  const carregarDados = useCallback(async () => {
    setLoading(true)
    try {
      const prodId = filterProduct !== "all" ? Number(filterProduct) : undefined
      const [saidasRes, produtosRes] = await Promise.all([
        saidaService.listar(search.trim() || undefined, prodId, 0, 100),
        produtoService.listar({ size: 100 }),
      ])
      setExits(saidasRes.content || [])
      setProducts(produtosRes.content || [])
    } catch (err) {
      console.error("Erro ao carregar saídas:", err)
    } finally {
      setLoading(false)
    }
  }, [search, filterProduct])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  const selectedProduct = products.find(p => p.id === Number(form.produtoId))
  const previewTotal =
    selectedProduct && form.quantidade && Number(form.quantidade) > 0
      ? (selectedProduct.preco * Number(form.quantidade)).toFixed(2).replace(".", ",")
      : null

  function openNew() {
    setEditingId(null)
    setForm({
      produtoId: products.length > 0 ? String(products[0].id) : "",
      quantidade: "",
      observacao: "",
    })
    setDialogOpen(true)
  }

  function handleEdit(exit: SaidaResponseDto) {
    setEditingId(exit.id)
    setForm({
      produtoId: String(exit.produtoId),
      quantidade: String(exit.quantidade),
      observacao: exit.observacao || "",
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.produtoId || !form.quantidade || Number(form.quantidade) <= 0) return
    setSaving(true)

    const payload = {
      produtoId: Number(form.produtoId),
      quantidade: Number(form.quantidade),
      observacao: form.observacao.trim() || undefined,
    }

    try {
      if (editingId !== null) {
        await saidaService.atualizar(editingId, payload)
      } else {
        await saidaService.criar(payload)
      }
      setDialogOpen(false)
      setForm({ produtoId: "", quantidade: "", observacao: "" })
      setEditingId(null)
      await carregarDados()
    } catch (err: any) {
      alert(err.message || "Erro ao registrar saída de venda")
    } finally {
      setSaving(false)
    }
  }

  const todayStr = new Date().toISOString().split("T")[0]
  const mesStr = new Date().toISOString().slice(0, 7)

  const receitaHoje = exits
    .filter(e => e.dataCriacao && e.dataCriacao.startsWith(todayStr))
    .reduce((a, e) => a + (e.valorTotal || 0), 0)

  const unidadesHoje = exits
    .filter(e => e.dataCriacao && e.dataCriacao.startsWith(todayStr))
    .reduce((a, e) => a + (e.quantidade || 0), 0)

  const receitaMes = exits
    .filter(e => e.dataCriacao && e.dataCriacao.startsWith(mesStr))
    .reduce((a, e) => a + (e.valorTotal || 0), 0)

  const ticketMedio = exits.length > 0 ? exits.reduce((a, e) => a + (e.valorTotal || 0), 0) / exits.length : 0

  return (
    <AppLayout title="Saída de Vendas" description="Registre as vendas e saídas de produtos do estoque">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Summary */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {[
            {
              label: "Receita Hoje",
              value: `R$ ${receitaHoje.toFixed(2).replace(".", ",")}`,
              icon: DollarSign,
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              label: "Unidades Vendidas Hoje",
              value: unidadesHoje,
              icon: ShoppingCart,
              color: "text-primary",
              bg: "bg-primary/10",
            },
            {
              label: "Receita do Mês",
              value: `R$ ${receitaMes.toFixed(2).replace(".", ",")}`,
              icon: TrendingUp,
              color: "text-chart-2",
              bg: "bg-chart-2/10",
            },
            {
              label: "Ticket Médio",
              value: `R$ ${ticketMedio.toFixed(2).replace(".", ",")}`,
              icon: ArrowUpCircle,
              color: "text-muted-foreground",
              bg: "bg-muted",
            },
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
              <Input
                placeholder="Buscar..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm w-52"
              />
            </div>
            <Select value={filterProduct} onValueChange={v => setFilterProduct(v ?? "all")}>
              <SelectTrigger className="h-9 text-sm w-48">
                <SelectValue placeholder="Produto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os produtos</SelectItem>
                {products.map(p => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={openNew} size="sm" className="gap-2">
            <Plus data-icon="inline-start" className="size-4" />
            Registrar Saída
          </Button>
        </div>

        {/* Table */}
        <Card className="min-w-0 overflow-hidden border-border/60">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="text-xs pl-6">Produto</TableHead>
                  <TableHead className="text-xs text-center">Quantidade</TableHead>
                  <TableHead className="hidden text-xs text-right sm:table-cell">Preço Unitário</TableHead>
                  <TableHead className="text-xs text-right">Valor Total</TableHead>
                  <TableHead className="hidden text-xs sm:table-cell">Responsável</TableHead>
                  <TableHead className="hidden text-xs text-right sm:table-cell">Data / Hora</TableHead>
                  <TableHead className="text-xs text-right pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                      <Loader2 className="size-6 mx-auto mb-2 animate-spin opacity-50" />
                      <p>Carregando histórico de vendas...</p>
                    </TableCell>
                  </TableRow>
                ) : exits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                      <ArrowUpCircle className="size-8 mx-auto mb-2 opacity-30" />
                      <p>Nenhuma saída encontrada</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  exits.map(exit => (
                    <TableRow key={exit.id} className="border-border/40 hover:bg-muted/40">
                      <TableCell className="pl-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
                            <ArrowUpCircle className="size-3.5 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{exit.produtoNome}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-center">
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
                          -{exit.quantidade}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden py-3 text-right text-xs text-muted-foreground sm:table-cell">
                        R$ {(exit.valorUnitario || 0).toFixed(2).replace(".", ",")}
                      </TableCell>
                      <TableCell className="py-3 text-right text-sm font-semibold text-foreground">
                        R$ {(exit.valorTotal || 0).toFixed(2).replace(".", ",")}
                      </TableCell>
                      <TableCell className="hidden py-3 text-xs text-muted-foreground sm:table-cell">
                        {exit.responsavelNome || "Usuário"}
                      </TableCell>
                      <TableCell className="hidden py-3 text-right text-xs text-muted-foreground sm:table-cell">
                        {exit.dataCriacao
                          ? format(new Date(exit.dataCriacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                          : "—"}
                      </TableCell>
                      <TableCell className="py-3 pr-6">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            aria-label={`Editar saída de ${exit.produtoNome}`}
                            onClick={() => handleEdit(exit)}
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                        </div>
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
            <DialogTitle>
              {editingId !== null ? "Editar Saída de Venda" : "Registrar Saída de Venda"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Registre a baixa de produtos por venda direta ou pedido.
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">
                Produto <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.produtoId}
                onValueChange={v => setForm(f => ({ ...f, produtoId: v ?? "" }))}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Selecione o produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(p => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.nome} — R$ {p.preco.toFixed(2).replace(".", ",")} (Estoque: {p.estoque})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">
                Quantidade Vendida <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                min="1"
                placeholder="0"
                value={form.quantidade}
                onChange={e => setForm(f => ({ ...f, quantidade: e.target.value }))}
                className="h-9 text-sm"
              />
            </div>
            {previewTotal && (
              <div className="rounded-md bg-primary/10 border border-primary/20 px-3 py-2 text-xs flex justify-between items-center text-foreground font-medium">
                <span>Total Estimado da Venda:</span>
                <span className="text-base font-bold text-primary">R$ {previewTotal}</span>
              </div>
            )}
            <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
              Responsável registrado automaticamente pelo seu usuário autenticado via token JWT.
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Observação</Label>
              <Textarea
                placeholder="Ex: Venda balcão, encomenda cliente..."
                value={form.observacao}
                onChange={e => setForm(f => ({ ...f, observacao: e.target.value }))}
                className="text-sm resize-none"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!form.produtoId || !form.quantidade || saving}
            >
              {saving ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Salvando...
                </>
              ) : editingId !== null ? (
                "Salvar Alterações"
              ) : (
                "Registrar Saída"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
