package com.paodavida.PaoDaVidaApplication.dtos.entradas;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record EntradaResponseDto(
        Long id,
        Long produtoId,
        String produtoNome,
        BigDecimal quantidade,
        UUID responsavelId,
        String responsavelNome,
        String observacao,
        Instant dataCriacao
) {
}
