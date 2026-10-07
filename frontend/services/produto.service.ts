import apiFetch from "@/lib/api"
import type {
  Page,
  ProdutoResponseDto,
  ProdutoRequestDto,
  ProdutoEstatisticaDto,
} from "@/lib/types"

export type FiltrosProduto = {
  nome?: string
  categoriaId?: number
  estoqueCritico?: boolean
  page?: number
  size?: number
  sort?: string
}

export const produtoService = {
  async listar(filtros: FiltrosProduto = {}): Promise<Page<ProdutoResponseDto>> {
    const params = new URLSearchParams()
    if (filtros.nome) params.set("nome", filtros.nome)
    if (filtros.categoriaId) params.set("categoriaId", String(filtros.categoriaId))
    if (filtros.estoqueCritico !== undefined) {
      params.set("estoqueCritico", String(filtros.estoqueCritico))
    }
    params.set("page", String(filtros.page ?? 0))
    params.set("size", String(filtros.size ?? 20))
    if (filtros.sort) params.set("sort", filtros.sort)

    return apiFetch<Page<ProdutoResponseDto>>(`/produtos?${params}`)
  },

  async buscarPorId(id: number): Promise<ProdutoResponseDto> {
    return apiFetch<ProdutoResponseDto>(`/produtos/${id}`)
  },

  async criar(dados: ProdutoRequestDto): Promise<ProdutoResponseDto> {
    return apiFetch<ProdutoResponseDto>("/produtos", {
      method: "POST",
      body: JSON.stringify(dados),
    })
  },

  async atualizar(id: number, dados: ProdutoRequestDto): Promise<ProdutoResponseDto> {
    return apiFetch<ProdutoResponseDto>(`/produtos/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    })
  },

  async remover(id: number): Promise<void> {
    return apiFetch<void>(`/produtos/${id}`, { method: "DELETE" })
  },

  async estatisticas(): Promise<ProdutoEstatisticaDto> {
    return apiFetch<ProdutoEstatisticaDto>("/produtos/estatisticas")
  },
}