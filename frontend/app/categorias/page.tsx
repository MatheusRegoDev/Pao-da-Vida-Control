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
import { Plus, Pencil, Trash2, Search, Tag } from "lucide-react"
import { categories as initialCategories, type Category } from "@/lib/data"

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState({ nome: "", descricao: "" })

  const filtered = categories.filter(c =>
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    c.descricao.toLowerCase().includes(search.toLowerCase())
  )

  function openNew() {
    setEditing(null)
    setForm({ nome: "", descricao: "" })
    setDialogOpen(true)
  }

  function openEdit(cat: Category) {
    setEditing(cat)
    setForm({ nome: cat.nome, descricao: cat.descricao })
    setDialogOpen(true)
  }

  function handleSave() {
    if (!form.nome.trim()) return
    if (editing) {
      setCategories(prev => prev.map(c => c.id === editing.id ? { ...c, ...form } : c))
    } else {
      const newCat: Category = {
        id: Math.max(...categories.map(c => c.id)) + 1,
        nome: form.nome,
        descricao: form.descricao,
        totalProdutos: 0,
        criadoEm: new Date().toISOString().split("T")[0],
      }
      setCategories(prev => [...prev, newCat])
    }
    setDialogOpen(false)
  }

  function handleDelete() {
    if (deleteId !== null) {
      setCategories(prev => prev.filter(c => c.id !== deleteId))
      setDeleteId(null)
    }
  }

  return (
    <AppLayout title="Categorias" description="Gerencie as categorias dos produtos da padaria">
      <div className="flex flex-col gap-6">
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total de Categorias", value: categories.length },
            { label: "Total de Produtos", value: categories.reduce((a, c) => a + c.totalProdutos, 0) },
            { label: "Maior Categoria", value: [...categories].sort((a, b) => b.totalProdutos - a.totalProdutos)[0]?.nome ?? "-" },
            { label: "Última Adicionada", value: [...categories].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))[0]?.nome ?? "-" },
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
        <Card className="border-border/60">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-semibold">Lista de Categorias</CardTitle>
            <CardDescription className="text-xs">{filtered.length} categoria(s) encontrada(s)</CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="text-xs pl-6 w-10">#</TableHead>
                  <TableHead className="text-xs">Nome</TableHead>
                  <TableHead className="text-xs">Descrição</TableHead>
                  <TableHead className="text-xs text-center">Produtos</TableHead>
                  <TableHead className="text-xs">Criada em</TableHead>
                  <TableHead className="text-xs text-right pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                      <Tag className="size-8 mx-auto mb-2 opacity-30" />
                      <p>Nenhuma categoria encontrada</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map(cat => (
                    <TableRow key={cat.id} className="border-border/40 hover:bg-muted/40">
                      <TableCell className="pl-6 py-4 text-xs text-muted-foreground">{cat.id}</TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
                            <Tag className="size-3.5 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{cat.nome}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-xs text-muted-foreground max-w-xs truncate">{cat.descricao}</TableCell>
                      <TableCell className="py-4 text-center">
                        <Badge variant="secondary" className="text-xs">{cat.totalProdutos}</Badge>
                      </TableCell>
                      <TableCell className="py-4 text-xs text-muted-foreground">
                        {new Date(cat.criadoEm + "T00:00:00").toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="py-4 pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="size-8 p-0" onClick={() => openEdit(cat)}>
                            <Pencil className="size-3.5" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="size-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(cat.id)}
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
              {editing ? "Atualize os dados da categoria." : "Preencha os dados para criar uma nova categoria."}
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nome" className="text-xs font-medium">Nome <span className="text-destructive">*</span></Label>
              <Input
                id="nome"
                placeholder="Ex: Pães Artesanais"
                value={form.nome}
                onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                className="h-9 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="descricao" className="text-xs font-medium">Descrição</Label>
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
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button size="sm" onClick={handleSave} disabled={!form.nome.trim()}>
              {editing ? "Salvar Alterações" : "Criar Categoria"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={deleteId !== null} onOpenChange={o => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Os produtos vinculados a esta categoria podem ser afetados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  )
}
