package com.paodavida.PaoDaVidaApplication.dtos.relatorios;

import java.math.BigDecimal;

public record ProducaoVendasPontoDto(
        String label,
        BigDecimal producao,
        BigDecimal vendas
) {
}
