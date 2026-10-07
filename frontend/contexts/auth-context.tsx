// frontend/contexts/auth-context.tsx
"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { authService } from "@/services/auth.service"
import type { UsuarioLogadoResposeDto, CargoUsuario } from "@/lib/types"

interface AuthContextType {
  usuario: UsuarioLogadoResposeDto | null
  carregando: boolean
  logout: () => void
  temCargo: (...cargosPermitidos: CargoUsuario[]) => boolean
  recarregarUsuario: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioLogadoResposeDto | null>(null)
  const [carregando, setCarregando] = useState(true)

  async function carregarUsuario() {
    if (!authService.isAuthenticated()) {
      setUsuario(null)
      setCarregando(false)
      return
    }

    try {
      const me = await authService.me()
      setUsuario(me)
    } catch {
      authService.logout()
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarUsuario()
  }, [])

  function temCargo(...cargosPermitidos: CargoUsuario[]): boolean {
    if (!usuario) return false
    return cargosPermitidos.includes(usuario.cargoUsuario)
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        carregando,
        logout: authService.logout,
        temCargo,
        recarregarUsuario: carregarUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)