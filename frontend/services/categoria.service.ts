import apiFetch from "@/lib/api"
import type {
  Page,
  CategoriaResponseDto,
  CategoriaRequestDto,
  CategoriaEstatisticaDto,
} from "@/lib/types"

export const categoriaService = {
  async listar(nome?: string, page = 0, size = 50): Promise<Page<CategoriaResponseDto>> {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    })
    if (nome) params.set("nome", nome)
    return apiFetch<Page<CategoriaResponseDto>>(`/categorias?${params}`)
  },

  async buscarPorId(id: number): Promise<CategoriaResponseDto> {
    return apiFetch<CategoriaResponseDto>(`/categorias/${id}`)
  },

  async criar(dados: CategoriaRequestDto): Promise<CategoriaResponseDto> {
    return apiFetch<CategoriaResponseDto>("/categorias", {
      method: "POST",
      body: JSON.stringify(dados),
    })
  },

  async atualizar(id: number, dados: CategoriaRequestDto): Promise<CategoriaResponseDto> {
    return apiFetch<CategoriaResponseDto>(`/categorias/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    })
  },

  async remover(id: number, forcar = false): Promise<void> {
    return apiFetch<void>(`/categorias/${id}?forcar=${forcar}`, {
      method: "DELETE",
    })
  },

  async estatisticas(): Promise<CategoriaEstatisticaDto> {
    return apiFetch<CategoriaEstatisticaDto>("/categorias/estatisticas")
  },
}