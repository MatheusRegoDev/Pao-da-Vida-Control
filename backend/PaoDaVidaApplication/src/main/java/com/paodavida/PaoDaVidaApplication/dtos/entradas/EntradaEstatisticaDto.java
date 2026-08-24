package com.paodavida.PaoDaVidaApplication.dtos.entradas;

import java.math.BigDecimal;

public record EntradaEstatisticaDto(
        BigDecimal unidadesHoje,
        long registrosHoje,
        BigDecimal unidadesNoMes,
        long totalRegistros
) {
}
