package com.paodavida.PaoDaVidaApplication.dtos.relatorios;

import java.math.BigDecimal;

public record RelatorioResumoDto(
        BigDecimal producaoPeriodo,
        BigDecimal vendaPeriodo,
        BigDecimal receitaPeriodo,
        BigDecimal aproveitamentoPercentual

) {
}
