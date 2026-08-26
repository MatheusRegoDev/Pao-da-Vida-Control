package com.paodavida.PaoDaVidaApplication.dtos.saidas;

import java.math.BigDecimal;
import java.time.Instant;

public record SaidaResponseDto(
        long id,
        String produtoNome,
        BigDecimal quantidade,
        BigDecimal valorUnitario,
        BigDecimal valorTotal,
        String responsavelNome,
        String observacao,
        Instant dataCriacao
) {
}
