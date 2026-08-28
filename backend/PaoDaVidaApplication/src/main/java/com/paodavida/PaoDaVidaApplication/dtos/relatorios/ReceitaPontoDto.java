package com.paodavida.PaoDaVidaApplication.dtos.relatorios;

import java.math.BigDecimal;

public record ReceitaPontoDto(
        String label,
        BigDecimal receita
) {
}
