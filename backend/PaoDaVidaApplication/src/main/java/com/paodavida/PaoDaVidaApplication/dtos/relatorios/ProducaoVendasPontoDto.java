package com.paodavida.PaoDaVidaApplication.dtos.relatorios;

import java.math.BigDecimal;

public record ProducaoVendasPontoDto(
        String Label,
        BigDecimal producao,
        BigDecimal vendas
) {
}
