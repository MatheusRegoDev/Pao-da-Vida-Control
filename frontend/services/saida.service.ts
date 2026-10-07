import apiFetch from "@/lib/api"
import type {
  Page,
  SaidaResponseDto,
  SaidaRequestDto,
  SaidaEstatisticaDto,
} from "@/lib/types"

export const saidaService = {
  async listar(nome?: string, produtoId?: number, page = 0, size = 20): Promise<Page<SaidaResponseDto>> {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    })
    if (nome) params.set("nome", nome)
    if (produtoId) params.set("produtoId", String(produtoId))
    return apiFetch<Page<SaidaResponseDto>>(`/saidas?${params}`)
  },

  async criar(dados: SaidaRequestDto): Promise<SaidaResponseDto> {
    return apiFetch<SaidaResponseDto>("/saidas", {
      method: "POST",
      body: JSON.stringify(dados),
    })
  },

  async atualizar(id: number, dados: SaidaRequestDto): Promise<SaidaResponseDto> {
    return apiFetch<SaidaResponseDto>(`/saidas/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    })
  },

  async estatisticas(): Promise<SaidaEstatisticaDto> {
    return apiFetch<SaidaEstatisticaDto>("/saidas/estatisticas")
  },
}