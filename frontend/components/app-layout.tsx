"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { authService } from "@/services/auth.service"

interface AppLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
}

export function AppLayout({ children, title, description }: AppLayoutProps) {
  const router = useRouter()
  const [verificado, setVerificado] = useState(false)
  const [autenticado, setAutenticado] = useState(false)

  useEffect(() => {
    const ok = authService.isAuthenticated()
    setAutenticado(ok)
    setVerificado(true)
    if (!ok) {
      router.replace("/login")
    }
  }, [router])

  if (!verificado || !autenticado) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title={title} description={description} />
        <main className="min-w-0 flex-1 p-3 sm:p-4 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
