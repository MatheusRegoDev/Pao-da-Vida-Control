package com.paodavida.PaoDaVidaApplication.dtos.saida;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import java.math.BigDecimal;

public record SaidaRequestDto(
    @NotNull(message = "O produto é obrigatório") Long produtoId,
    @NotNull(message = "A quantidade é obrigatória") @Min(value = 1, message = "A quantidade deve ser maior que zero") Integer quantidade,
    @NotNull(message = "O valor unitário é obrigatório") BigDecimal valorUnitario,
    String observacao,
    String responsavel
) {}
