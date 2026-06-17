"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  Search,
  Users,
  Pencil,
  Trash2,
  MoreHorizontal,
  ShieldCheck,
  UserCog,
  UserCheck,
  ShoppingCart,
  KeyRound,
} from "lucide-react"
import { users as initialUsers, type User, type UserRole, type UserStatus } from "@/lib/data"
import { cn } from "@/lib/utils"

const roles: UserRole[] = ['Administrador', 'Gerente', 'Operador', 'Vendedor']
const setores = ['Gestão', 'Produção', 'Confeitaria', 'Vendas', 'Financeiro', 'Estoque']

const roleConfig: Record<UserRole, { label: string; icon: React.ElementType; className: string }> = {
  Administrador: { label: 'Administrador', icon: ShieldCheck, className: 'bg-chart-1/15 text-chart-1' },
  Gerente: { label: 'Gerente', icon: UserCog, className: 'bg-chart-2/15 text-chart-2' },
  Operador: { label: 'Operador', icon: UserCheck, className: 'bg-chart-4/15 text-chart-4' },
  Vendedor: { label: 'Vendedor', icon: ShoppingCart, className: 'bg-chart-5/15 text-chart-5' },
}

const avatarColors = [
  'bg-chart-1/20 text-chart-1',
  'bg-chart-2/20 text-chart-2',
  'bg-chart-3/20 text-chart-3',
  'bg-chart-4/20 text-chart-4',
  'bg-chart-5/20 text-chart-5',
]

type FormState = {
  nome: string
  email: string
  cargo: UserRole
  setor: string
  status: UserStatus
  senha: string
}

const emptyForm: FormState = {
  nome: '',
  email: '',
  cargo: 'Operador',
  setor: 'Produção',
  status: 'Ativo',
  senha: '',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function UsuariosPage() {
  const [userList, setUserList] = useState<User[]>(initialUsers)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState<string>('todos')
  const [filterStatus, setFilterStatus] = useState<string>('todos')

  const [dialogOpen, setDialogOpen] = useState(false)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editing, setEditing] = useState<User | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [formError, setFormError] = useState('')

  const filtered = userList.filter(u => {
    const matchSearch =
      u.nome.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.setor.toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole === 'todos' || u.cargo === filterRole
    const matchStatus = filterStatus === 'todos' || u.status === filterStatus
    return matchSearch && matchRole && matchStatus
  })

  const statsTotal = userList.length
  const statsAtivos = userList.filter(u => u.status === 'Ativo').length
  const statsInativos = userList.filter(u => u.status === 'Inativo').length
  const statsAdmins = userList.filter(u => u.cargo === 'Administrador').length

  function openNew() {
    setEditing(null)
    setForm(emptyForm)
    setFormError('')
    setDialogOpen(true)
  }

  function openEdit(user: User) {
    setEditing(user)
    setForm({
      nome: user.nome,
      email: user.email,
      cargo: user.cargo,
      setor: user.setor,
      status: user.status,
      senha: '',
    })
    setFormError('')
    setDialogOpen(true)
  }

  function openReset(user: User) {
    setEditing(user)
    setResetDialogOpen(true)
  }

  function handleSave() {
    if (!form.nome.trim() || !form.email.trim()) {
      setFormError('Nome e e-mail são obrigatórios.')
      return
    }
    const emailExists = userList.some(
      u => u.email === form.email.trim() && u.id !== editing?.id
    )
    if (emailExists) {
      setFormError('Este e-mail já está cadastrado.')
      return
    }
    if (editing) {
      setUserList(prev =>
        prev.map(u =>
          u.id === editing.id
            ? { ...u, nome: form.nome.trim(), email: form.email.trim(), cargo: form.cargo, setor: form.setor, status: form.status }
            : u
        )
      )
    } else {
      const initials = form.nome.trim().split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
      const newUser: User = {
        id: Math.max(...userList.map(u => u.id)) + 1,
        nome: form.nome.trim(),
        email: form.email.trim(),
        cargo: form.cargo,
        setor: form.setor,
        status: form.status,
        ultimoAcesso: new Date().toISOString(),
        criadoEm: new Date().toISOString().split('T')[0],
        avatar: initials,
      }
      setUserList(prev => [...prev, newUser])
    }
    setDialogOpen(false)
  }

  function handleDelete() {
    if (deleteId !== null) {
      setUserList(prev => prev.filter(u => u.id !== deleteId))
      setDeleteId(null)
    }
  }

  function handleToggleStatus(user: User) {
    setUserList(prev =>
      prev.map(u =>
        u.id === user.id
          ? { ...u, status: u.status === 'Ativo' ? 'Inativo' : 'Ativo' }
          : u
      )
    )
  }

  return (
    <AppLayout title="Usuários" description="Gerencie os usuários e permissões do sistema">
      <div className="flex flex-col gap-6">

        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, e-mail ou setor..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="h-9 w-40 text-xs">
                <SelectValue placeholder="Cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os cargos</SelectItem>
                {roles.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-9 w-36 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Ativo">Ativos</SelectItem>
                <SelectItem value="Inativo">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={openNew} size="sm" className="gap-2 shrink-0">
            <Plus data-icon="inline-start" className="size-4" />
            Novo Usuário
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Total de Usuários', value: statsTotal },
            { label: 'Usuários Ativos', value: statsAtivos },
            { label: 'Usuários Inativos', value: statsInativos },
            { label: 'Administradores', value: statsAdmins },
          ].map(s => (
            <Card key={s.label} className="border-border/60">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-lg font-bold text-foreground">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card className="border-border/60">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-semibold">Lista de Usuários</CardTitle>
            <CardDescription className="text-xs">
              {filtered.length} usuário(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="text-xs pl-6">Usuário</TableHead>
                  <TableHead className="text-xs">Cargo</TableHead>
                  <TableHead className="text-xs">Setor</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Último acesso</TableHead>
                  <TableHead className="text-xs">Criado em</TableHead>
                  <TableHead className="text-xs text-right pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                      <Users className="size-8 mx-auto mb-2 opacity-30" />
                      <p>Nenhum usuário encontrado</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((user, idx) => {
                    const RoleIcon = roleConfig[user.cargo].icon
                    return (
                      <TableRow key={user.id} className="border-border/40 hover:bg-muted/40">
                        {/* Avatar + nome + email */}
                        <TableCell className="pl-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                                avatarColors[idx % avatarColors.length]
                              )}
                            >
                              {user.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground leading-tight">{user.nome}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Cargo */}
                        <TableCell className="py-4">
                          <div className={cn('inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium', roleConfig[user.cargo].className)}>
                            <RoleIcon className="size-3" />
                            {user.cargo}
                          </div>
                        </TableCell>

                        {/* Setor */}
                        <TableCell className="py-4 text-xs text-muted-foreground">
                          {user.setor}
                        </TableCell>

                        {/* Status */}
                        <TableCell className="py-4">
                          <Badge
                            variant={user.status === 'Ativo' ? 'default' : 'secondary'}
                            className={cn(
                              'text-xs',
                              user.status === 'Ativo'
                                ? 'bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 border-0'
                                : 'bg-muted text-muted-foreground border-0'
                            )}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>

                        {/* Último acesso */}
                        <TableCell className="py-4 text-xs text-muted-foreground whitespace-nowrap">
                          {formatDateTime(user.ultimoAcesso)}
                        </TableCell>

                        {/* Criado em */}
                        <TableCell className="py-4 text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(user.criadoEm + 'T00:00:00')}
                        </TableCell>

                        {/* Ações */}
                        <TableCell className="py-4 pr-6">
                          <div className="flex items-center justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="size-8 p-0">
                                  <MoreHorizontal className="size-3.5" />
                                  <span className="sr-only">Ações</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem onClick={() => openEdit(user)} className="text-xs gap-2">
                                  <Pencil className="size-3.5" />
                                  Editar dados
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openReset(user)} className="text-xs gap-2">
                                  <KeyRound className="size-3.5" />
                                  Redefinir senha
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleToggleStatus(user)}
                                  className="text-xs gap-2"
                                >
                                  <UserCheck className="size-3.5" />
                                  {user.status === 'Ativo' ? 'Desativar' : 'Reativar'}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => setDeleteId(user.id)}
                                  className="text-xs gap-2 text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="size-3.5" />
                                  Excluir usuário
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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

        {/* Permissions Reference Card */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Referência de Permissões por Cargo</CardTitle>
            <CardDescription className="text-xs">Resumo das permissões disponíveis para cada nível de acesso</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(
                [
                  {
                    cargo: 'Administrador' as UserRole,
                    descricao: 'Acesso total ao sistema. Pode gerenciar usuários, configurações e todos os módulos.',
                    permissoes: ['Dashboard', 'Categorias', 'Produtos', 'Entradas', 'Saídas', 'Relatórios', 'Usuários'],
                  },
                  {
                    cargo: 'Gerente' as UserRole,
                    descricao: 'Gerencia produção, estoque e visualiza relatórios. Sem acesso à gestão de usuários.',
                    permissoes: ['Dashboard', 'Categorias', 'Produtos', 'Entradas', 'Saídas', 'Relatórios'],
                  },
                  {
                    cargo: 'Operador' as UserRole,
                    descricao: 'Registra entradas de produção e consulta estoque. Sem acesso a relatórios e usuários.',
                    permissoes: ['Dashboard', 'Produtos', 'Entradas'],
                  },
                  {
                    cargo: 'Vendedor' as UserRole,
                    descricao: 'Registra saídas de vendas e consulta estoque disponível.',
                    permissoes: ['Dashboard', 'Produtos', 'Saídas'],
                  },
                ] as const
              ).map(({ cargo, descricao, permissoes }) => {
                const RoleIcon = roleConfig[cargo].icon
                return (
                  <div key={cargo} className="flex flex-col gap-3 rounded-lg border border-border/60 p-4">
                    <div className="flex items-center gap-2">
                      <div className={cn('flex size-7 items-center justify-center rounded-md', roleConfig[cargo].className)}>
                        <RoleIcon className="size-3.5" />
                      </div>
                      <span className="text-sm font-semibold text-foreground">{cargo}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{descricao}</p>
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {permissoes.map(p => (
                        <span key={p} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground font-medium">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={open => { setDialogOpen(open); if (!open) setFormError('') }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
            <DialogDescription className="text-xs">
              {editing ? 'Atualize os dados do usuário.' : 'Preencha os dados para cadastrar um novo usuário.'}
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="flex flex-col gap-4 py-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="u-nome" className="text-xs font-medium">
                  Nome completo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="u-nome"
                  placeholder="Ex: Carlos Silva"
                  value={form.nome}
                  onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                  className="h-9 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="u-email" className="text-xs font-medium">
                  E-mail <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="u-email"
                  type="email"
                  placeholder="usuario@padaria.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="h-9 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="u-cargo" className="text-xs font-medium">Cargo</Label>
                <Select value={form.cargo} onValueChange={v => setForm(f => ({ ...f, cargo: v as UserRole }))}>
                  <SelectTrigger id="u-cargo" className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="u-setor" className="text-xs font-medium">Setor</Label>
                <Select value={form.setor} onValueChange={v => setForm(f => ({ ...f, setor: v }))}>
                  <SelectTrigger id="u-setor" className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {setores.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="u-status" className="text-xs font-medium">Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as UserStatus }))}>
                  <SelectTrigger id="u-status" className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {!editing && (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="u-senha" className="text-xs font-medium">Senha provisória</Label>
                  <Input
                    id="u-senha"
                    type="password"
                    placeholder="••••••••"
                    value={form.senha}
                    onChange={e => setForm(f => ({ ...f, senha: e.target.value }))}
                    className="h-9 text-sm"
                  />
                </div>
              )}
            </div>
            {formError && (
              <p className="text-xs text-destructive">{formError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button size="sm" onClick={handleSave} disabled={!form.nome.trim() || !form.email.trim()}>
              {editing ? 'Salvar Alterações' : 'Criar Usuário'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Redefinir senha?</AlertDialogTitle>
            <AlertDialogDescription>
              Uma nova senha provisória será gerada para <strong>{editing?.nome}</strong>. O usuário deverá alterá-la no próximo acesso.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => setResetDialogOpen(false)}>
              Confirmar redefinição
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirm */}
      <AlertDialog open={deleteId !== null} onOpenChange={o => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir usuário?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O usuário perderá acesso permanentemente ao sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  )
}
