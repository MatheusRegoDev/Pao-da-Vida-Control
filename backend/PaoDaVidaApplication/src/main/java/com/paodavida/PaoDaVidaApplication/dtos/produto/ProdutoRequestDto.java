package com.paodavida.PaoDaVidaApplication.dtos.produto;

import com.paodavida.PaoDaVidaApplication.models.enums.UnidadeMedida;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record ProdutoRequestDto(
        @NotBlank(message = "O nome do produto não pode ser nulo ou vazio")
        String nome,

        @NotNull(message = "O produto é obrigatório ter categoria")
        Long categoriaId,

        @NotNull(message = "O produto é obrigatório ter uma Unidade de Medida")
        UnidadeMedida unidade,

        @NotNull(message = "O preço do produto não pode ser nulo")
        @Positive(message = "O preço do produto deve ser um valor positivo")
        BigDecimal preco,

        @NotNull(message = "O estoque do produto não pode ser nulo")
        @PositiveOrZero(message = "O estoque do produto deve ser um valor positivo ou zero")
        BigDecimal estoque,

        @NotNull(message = "O estoque mínimo do produto não pode ser nulo")
        @PositiveOrZero(message = "O estoque mínimo do produto deve ser um valor positivo ou zero")
        BigDecimal estoqueMinimo
) {
}
