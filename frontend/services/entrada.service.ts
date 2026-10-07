import apiFetch from "@/lib/api"
import type {
  Page,
  EntradaResponseDto,
  EntradaRequestDto,
  EntradaEstatisticaDto,
} from "@/lib/types"

export const entradaService = {
  async listar(nome?: string, produtoId?: number, page = 0, size = 20): Promise<Page<EntradaResponseDto>> {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    })
    if (nome) params.set("nome", nome)
    if (produtoId) params.set("produtoId", String(produtoId))
    return apiFetch<Page<EntradaResponseDto>>(`/entradas?${params}`)
  },

  async criar(dados: EntradaRequestDto): Promise<EntradaResponseDto> {
    return apiFetch<EntradaResponseDto>("/entradas", {
      method: "POST",
      body: JSON.stringify(dados),
    })
  },

  async atualizar(id: number, dados: EntradaRequestDto): Promise<EntradaResponseDto> {
    return apiFetch<EntradaResponseDto>(`/entradas/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    })
  },

  async estatisticas(): Promise<EntradaEstatisticaDto> {
    return apiFetch<EntradaEstatisticaDto>("/entradas/estatisticas")
  },
}