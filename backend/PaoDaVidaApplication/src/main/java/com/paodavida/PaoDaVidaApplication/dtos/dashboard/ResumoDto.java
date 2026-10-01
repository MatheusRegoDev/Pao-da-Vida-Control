package com.paodavida.PaoDaVidaApplication.dtos.dashboard;

import java.math.BigDecimal;

public record ResumoDto(
        long totalProdutos,
        BigDecimal estoqueTotal,
        BigDecimal producaoHoje,
        BigDecimal vendasHoje,
        BigDecimal receitaHoje,
        long estoqueCritico

) {
}
