import apiFetch, { TOKEN_STORAGE_KEY } from "@/lib/api"
import type {
  CargoUsuario,
  LoginRequestDto,
  TokenResponseDto,
  UsuarioLogadoResposeDto,
} from "@/lib/types"

export const authService = {
  async login(credenciais: LoginRequestDto): Promise<TokenResponseDto> {
    const data = await apiFetch<TokenResponseDto>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credenciais),
    })
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token)
    }
    return data
  },

  async me(): Promise<UsuarioLogadoResposeDto> {
    const data = await apiFetch<{
      id: string
      nome: string
      email: string
      cargo: CargoUsuario
    }>("/auth/me")

    return {
      id: data.id,
      nome: data.nome,
      email: data.email,
      cargoUsuario: data.cargo,
    }
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      window.location.href = "/login"
    }
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false
    return !!localStorage.getItem(TOKEN_STORAGE_KEY)
  },
}