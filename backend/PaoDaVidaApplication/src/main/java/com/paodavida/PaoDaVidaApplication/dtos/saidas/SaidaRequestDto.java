package com.paodavida.PaoDaVidaApplication.dtos.saidas;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;


import java.math.BigDecimal;

public record SaidaRequestDto(
        @NotNull(message = "O campo produto é obrigatório")
        Long produtoId,
        @NotNull(message = "O campo quantidade é obrigatório")
        @Positive(message = "O campo quantidade deve ser um valor positivo")
        BigDecimal quantidade,
        String observacao
) {
}
