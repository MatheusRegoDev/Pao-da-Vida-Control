package com.paodavida.PaoDaVidaApplication.dtos.entrada;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

public record EntradaRequestDto(
    @NotNull(message = "O produto é obrigatório") Long produtoId,
    @NotNull(message = "A quantidade é obrigatória") @Min(value = 1, message = "A quantidade deve ser maior que zero") Integer quantidade,
    String observacao,
    String responsavel
) {}
