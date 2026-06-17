"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"
import { products } from "@/lib/data"

interface AppHeaderProps {
  title: string
  description?: string
}

export function AppHeader({ title, description }: AppHeaderProps) {
  const lowStockCount = products.filter(p => p.estoque < p.estoqueMinimo).length

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-4 sticky top-0 z-10">
      <SidebarTrigger className="size-8" />
      <Separator orientation="vertical" className="h-5" />
      <div className="flex flex-1 items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold text-foreground">{title}</h1>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {lowStockCount > 0 && (
            <div className="relative flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs text-destructive">
              <Bell className="size-3.5" />
              <span>{lowStockCount} produto(s) com estoque baixo</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
