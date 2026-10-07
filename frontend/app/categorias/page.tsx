"use client"

import { useState, useEffect, useCallback } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, Search, Tag, Loader2 } from "lucide-react"

import { categoriaService } from "@/services/categoria.service"
import type { CategoriaResponseDto } from "@/lib/types"

export default function CategoriasPage() {
  const [categories, setCategories] = useState<CategoriaResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteCat, setDeleteCat] = useState<CategoriaResponseDto | null>(null)
  const [editing, setEditing] = useState<CategoriaResponseDto | null>(null)
  const [form, setForm] = useState({ nome: "", descricao: "" })

  const carregarCategorias = useCallback(async () => {
    setLoading(true)
    try {
      const res = await categoriaService.listar(search.trim() || undefined, 0, 100)
      setCategories(res.content || [])
    } catch (err) {
      console.error("Erro ao carregar categorias:", err)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    carregarCategorias()
  }, [carregarCategorias])

  function openNew() {
    setEditing(null)
    setForm({ nome: "", descricao: "" })
    setDialogOpen(true)
  }

  function openEdit(cat: CategoriaResponseDto) {
    setEditing(cat)
    setForm({ nome: cat.nome, descricao: cat.descricao || "" })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.nome.trim()) return
    setSaving(true)
    const payload = {
      nome: form.nome.trim(),
      descricao: form.descricao.trim(),
    }

    try {
      if (editing) {
        await categoriaService.atualizar(editing.id, payload)
      } else {
        await categoriaService.criar(payload)
      }
      setDialogOpen(false)
      await carregarCategorias()
    } catch (err: any) {
      alert(err.message || "Erro ao salvar categoria")
    } finally {
      setSaving(false)
    }
  }

  async function handleRemover(id: number, possuiProdutos: boolean) {
    const forcar = possuiProdutos
      ? confirm("Esta categoria possui produtos associados. Deseja forçar a exclusão?")
      : false
    try {
      setDeleting(true)
      await categoriaService.remover(id, forcar)
      setDeleteCat(null)
      await carregarCategorias()
    } catch (err: any) {
      alert(err.message || "Erro ao remover categoria")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AppLayout title="Categorias" description="Gerencie as categorias dos produtos da padaria">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Header row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar categorias..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <Button onClick={openNew} size="sm" className="gap-2">
            <Plus data-icon="inline-start" className="size-4" />
            Nova Categoria
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {[
            { label: "Total de Categorias", value: categories.length },
            {
              label: "Total de Produtos",
              value: categories.reduce((a, c) => a + (c.totalProdutos || 0), 0),
            },
            {
              label: "Maior Categoria",
              value:
                [...categories].sort((a, b) => (b.totalProdutos || 0) - (a.totalProdutos || 0))[0]
                  ?.nome ?? "-",
            },
            {
              label: "Última Adicionada",
              value:
                [...categories].sort((a, b) =>
                  (b.dataCriacao || "").localeCompare(a.dataCriacao || "")
                )[0]?.nome ?? "-",
            },
          ].map(s => (
            <Card key={s.label} className="border-border/60">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-lg font-bold text-foreground truncate">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card className="min-w-0 overflow-hidden border-border/60">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-semibold">Lista de Categorias</CardTitle>
            <CardDescription className="text-xs">
              {categories.length} categoria(s) encontrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="hidden w-10 pl-6 text-xs sm:table-cell">#</TableHead>
                  <TableHead className="text-xs">Nome</TableHead>
                  <TableHead className="hidden text-xs sm:table-cell">Descrição</TableHead>
                  <TableHead className="w-16 text-center text-xs">Produtos</TableHead>
                  <TableHead className="hidden text-xs sm:table-cell">Criada em</TableHead>
                  <TableHead className="w-20 pr-3 text-right text-xs sm:pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                      <Loader2 className="size-6 mx-auto mb-2 animate-spin opacity-50" />
                      <p>Carregando categorias...</p>
                    </TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                      <Tag className="size-8 mx-auto mb-2 opacity-30" />
                      <p>Nenhuma categoria encontrada</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map(cat => (
                    <TableRow key={cat.id} className="border-border/40 hover:bg-muted/40">
                      <TableCell className="hidden py-4 pl-6 text-xs text-muted-foreground sm:table-cell">
                        {cat.id}
                      </TableCell>
                      <TableCell className="min-w-0 py-4">
                        <div className="flex min-w-0 items-center gap-2">
                          <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
                            <Tag className="size-3.5 text-primary" />
                          </div>
                          <span className="min-w-0 truncate text-sm font-medium text-foreground">
                            {cat.nome}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden max-w-xs truncate py-4 text-xs text-muted-foreground sm:table-cell">
                        {cat.descricao || "-"}
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <Badge variant="secondary" className="text-xs">
                          {cat.totalProdutos || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden py-4 text-xs text-muted-foreground sm:table-cell">
                        {cat.dataCriacao
                          ? new Date(cat.dataCriacao).toLocaleDateString("pt-BR")
                          : "-"}
                      </TableCell>
                      <TableCell className="py-4 pr-3 sm:pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="size-8 p-0"
                            onClick={() => openEdit(cat)}
                          >
                            <Pencil className="size-3.5" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="size-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => setDeleteCat(cat)}
                          >
                            <Trash2 className="size-3.5" />
                            <span className="sr-only">Excluir</span>
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

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
            <DialogDescription className="text-xs">
              {editing
                ? "Atualize os dados da categoria."
                : "Preencha os dados para criar uma nova categoria."}
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nome" className="text-xs font-medium">
                Nome <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nome"
                placeholder="Ex: Pães Artesanais"
                value={form.nome}
                onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                className="h-9 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="descricao" className="text-xs font-medium">
                Descrição
              </Label>
              <Textarea
                id="descricao"
                placeholder="Descrição da categoria..."
                value={form.descricao}
                onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
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
            <Button size="sm" onClick={handleSave} disabled={!form.nome.trim() || saving}>
              {saving ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Salvando...
                </>
              ) : editing ? (
                "Salvar Alterações"
              ) : (
                "Criar Categoria"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={deleteCat !== null} onOpenChange={o => !o && setDeleteCat(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria &quot;{deleteCat?.nome}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteCat?.possuiProdutos || (deleteCat?.totalProdutos ?? 0) > 0 ? (
                <span className="text-destructive font-medium block">
                  Atenção: Esta categoria possui {deleteCat?.totalProdutos} produto(s) associado(s).
                  A exclusão exigirá confirmação para desvincular ou remover os produtos.
                </span>
              ) : (
                "Esta ação removerá a categoria permanentemente do sistema."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteCat &&
                handleRemover(
                  deleteCat.id,
                  deleteCat.possuiProdutos ?? (deleteCat.totalProdutos > 0)
                )
              }
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  )
}
