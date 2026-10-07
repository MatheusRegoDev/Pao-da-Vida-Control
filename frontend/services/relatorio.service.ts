import apiFetch from "@/lib/api"
import type {
  RelatorioResumoDto,
  RelatorioGraficoDto,
  CategoriaVendaDto,
  TopProdutosDto,
  PeriodoRelatorio,
} from "@/lib/types"

export const relatorioService = {
  async resumo(): Promise<RelatorioResumoDto> {
    return apiFetch<RelatorioResumoDto>("/relatorios/resumo")
  },

  async grafico(periodo: PeriodoRelatorio = "DIARIO"): Promise<RelatorioGraficoDto> {
    return apiFetch<RelatorioGraficoDto>(`/relatorios/grafico?periodo=${periodo}`)
  },

  async vendasPorCategoria(): Promise<CategoriaVendaDto[]> {
    return apiFetch<CategoriaVendaDto[]>("/relatorios/vendas-por-categoria")
  },

  async topProdutos(): Promise<TopProdutosDto[]> {
    return apiFetch<TopProdutosDto[]>("/relatorios/top-produtos")
  },
}