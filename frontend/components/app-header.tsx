"use client"

import { useEffect, useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Bell, AlertTriangle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { produtoService } from "@/services/produto.service"
import { useAuth } from "@/contexts/auth-context"
import { CARGO_LABELS, type ProdutoResponseDto } from "@/lib/types"

interface AppHeaderProps {
  title: string
  description?: string
}

export function AppHeader({ title, description }: AppHeaderProps) {
  const { usuario, logout } = useAuth()
  const [estoqueCritico, setEstoqueCritico] = useState<ProdutoResponseDto[]>([])

  useEffect(() => {
    let ativo = true

    produtoService
      .listar({ estoqueCritico: true, size: 50 })
      .then((pagina) => {
        if (ativo) setEstoqueCritico(pagina.content)
      })
      .catch(() => {
        if (ativo) setEstoqueCritico([])
      })

    return () => {
      ativo = false
    }
  }, [])

  const lowStockCount = estoqueCritico.length

  return (
    <header className="sticky top-0 z-10 flex min-w-0 h-14 items-center gap-2 border-b border-border bg-card px-3 sm:gap-3 sm:px-4">
      <SidebarTrigger className="size-8" />
      <Separator orientation="vertical" className="h-5" />
      <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-foreground">{title}</h1>
          {description && (
            <p className="hidden truncate text-xs text-muted-foreground sm:block">{description}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {lowStockCount > 0 && (
            <Dialog>
              <DialogTrigger
                render={
                  <Button variant="ghost" className="relative size-8 rounded-lg bg-destructive/10 p-0 text-destructive hover:bg-destructive/15 hover:text-destructive sm:h-auto sm:w-auto sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs" title={`${lowStockCount} produto(s) com estoque crítico`} aria-label={`${lowStockCount} produtos com estoque crítico`} />
                }
              >
                <Bell className="size-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">{lowStockCount} produto(s) com estoque crítico</span>
              </DialogTrigger>
              <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2"><AlertTriangle className="size-5 text-destructive" /> Estoque crítico</DialogTitle>
                  <DialogDescription>Produtos abaixo do estoque mínimo e que precisam de reposição.</DialogDescription>
                </DialogHeader>
                <div className="flex max-h-72 flex-col gap-2 overflow-y-auto">
                  {estoqueCritico.map(product => (
                    <div key={product.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{product.nome}</p>
                        <p className="text-xs text-muted-foreground">Mínimo: {product.estoqueMinimo} {product.unidade}</p>
                      </div>
                      <span className="shrink-0 rounded-md bg-destructive/10 px-2 py-1 text-sm font-semibold text-destructive">{product.estoque} {product.unidade}</span>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}

          {usuario && (
            <div className="hidden items-center gap-2 sm:flex">
              <div className="text-right leading-tight">
                <p className="text-xs font-semibold text-foreground">{usuario.nome}</p>
                <p className="text-[11px] text-muted-foreground">
                  {CARGO_LABELS[usuario.cargoUsuario] ?? usuario.cargoUsuario}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-destructive"
                title="Sair do sistema"
                aria-label="Sair do sistema"
                onClick={logout}
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
