import apiFetch from "@/lib/api"
import type { ResumoDto, EstoqueTotalDto } from "@/lib/types"

export const dashboardService = {
  async resumo(): Promise<ResumoDto> {
    return apiFetch<ResumoDto>("/dashboard/resumo")
  },

  async estoqueTotal(): Promise<EstoqueTotalDto> {
    return apiFetch<EstoqueTotalDto>("/dashboard/estoque-total")
  },
}