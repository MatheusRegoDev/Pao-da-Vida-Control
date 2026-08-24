package com.paodavida.PaoDaVidaApplication.dtos.entradas;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record EntradaRequestDto(
        @NotNull(message = "O campo Produto é obrigatório")
        Long produtoId,
        @NotNull(message = "O campo Quantidade é obrigatório")
        @Positive(message = "A quantidade deve ser um valor positivo")
        BigDecimal quantidade,
        String observacao
) {
}
