package com.paodavida.PaoDaVidaApplication.dtos.relatorios;

import java.math.BigDecimal;

public record CategoriaVendaDto(
        String categoria,
        BigDecimal quantidade,
        BigDecimal percentual
) {
}
