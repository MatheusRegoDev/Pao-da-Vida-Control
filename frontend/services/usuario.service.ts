import apiFetch from "@/lib/api"
import type {
  Page,
  UsuarioResponseDto,
  UsuariosRequestDto,
  UsuarioUpdateDto,
  UsuarioRedefinirSenhaDto,
  UsuarioRequestNovoStatus,
  UsuarioEstatisticaDto,
  CargoUsuario,
  SetorUsuario,
} from "@/lib/types"

export const usuarioService = {
  async listar(filtros: {
    termo?: string
    cargo?: CargoUsuario
    setor?: SetorUsuario
    page?: number
    size?: number
  } = {}): Promise<Page<UsuarioResponseDto>> {
    const params = new URLSearchParams({
      page: String(filtros.page ?? 0),
      size: String(filtros.size ?? 10),
      sort: "nome",
    })
    if (filtros.termo) params.set("termo", filtros.termo)
    if (filtros.cargo) params.set("cargo", filtros.cargo)
    if (filtros.setor) params.set("setor", filtros.setor)

    return apiFetch<Page<UsuarioResponseDto>>(`/usuarios?${params}`)
  },

  async criar(dados: UsuariosRequestDto): Promise<UsuarioResponseDto> {
    return apiFetch<UsuarioResponseDto>("/usuarios", {
      method: "POST",
      body: JSON.stringify(dados),
    })
  },

  async atualizar(id: string, dados: UsuarioUpdateDto): Promise<UsuarioResponseDto> {
    return apiFetch<UsuarioResponseDto>(`/usuarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    })
  },

  async alterarStatus(id: string, novoStatus: boolean): Promise<UsuarioResponseDto> {
    const payload: UsuarioRequestNovoStatus = { novoStatus }
    return apiFetch<UsuarioResponseDto>(`/usuarios/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  },

  async redefinirSenha(id: string, novaSenha: string): Promise<void> {
    const payload: UsuarioRedefinirSenhaDto = { novaSenha }
    return apiFetch<void>(`/usuarios/${id}/senha`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  },

  async remover(id: string): Promise<void> {
    return apiFetch<void>(`/usuarios/${id}`, { method: "DELETE" })
  },

  async estatisticas(): Promise<UsuarioEstatisticaDto> {
    return apiFetch<UsuarioEstatisticaDto>("/usuarios/estatisticas")
  },
}