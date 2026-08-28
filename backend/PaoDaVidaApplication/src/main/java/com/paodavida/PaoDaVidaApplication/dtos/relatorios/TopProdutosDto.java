package com.paodavida.PaoDaVidaApplication.dtos.relatorios;

import java.math.BigDecimal;

public record TopProdutosDto(
        String produto,
        String categoria,
        BigDecimal vendas,
        BigDecimal receita
) {
}
