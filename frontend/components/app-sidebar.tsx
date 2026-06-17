"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Tag,
  Package,
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3,
  ChevronRight,
  ClipboardList,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    label: "Principal",
    items: [
      { title: "Dashboard", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    label: "Cadastros",
    items: [
      { title: "Categorias", href: "/categorias", icon: Tag },
      { title: "Produtos", href: "/produtos", icon: Package },
    ],
  },
  {
    label: "Estoque",
    items: [
      { title: "Entrada de Produção", href: "/entradas", icon: ArrowDownCircle },
      { title: "Saída de Vendas", href: "/saidas", icon: ArrowUpCircle },
    ],
  },
  {
    label: "Relatórios",
    items: [
      { title: "Gráficos e Análises", href: "/relatorios", icon: BarChart3 },
    ],
  },
  {
    label: "Administração",
    items: [
      { title: "Usuários", href: "/usuarios", icon: Users },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="py-5 px-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <ClipboardList className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-sidebar-foreground leading-tight">PadariaGest</p>
            <p className="text-xs text-sidebar-foreground/60">Gerenciamento</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navItems.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs font-semibold uppercase tracking-widest">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href} className="flex items-center gap-3">
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                          {isActive && <ChevronRight className="ml-auto size-3.5 opacity-60" />}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="px-4 py-4">
        <div className="rounded-lg bg-sidebar-accent/60 p-3 text-xs text-sidebar-foreground/70">
          <p className="font-medium text-sidebar-foreground/90">Padaria Artesanal</p>
          <p className="mt-0.5">Sistema v1.0</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
