package com.paodavida.PaoDaVidaApplication.dtos.saidas;

import java.math.BigDecimal;

public record SaidaEstatisticaDto(
        BigDecimal receitaHoje,
        BigDecimal unidadesVendidasHoje,
        BigDecimal receitaMes,
        BigDecimal ticketMedio,
        long totalVendas
) {
}
