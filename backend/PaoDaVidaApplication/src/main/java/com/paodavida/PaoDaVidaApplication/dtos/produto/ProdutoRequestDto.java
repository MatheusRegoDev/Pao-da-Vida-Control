package com.paodavida.PaoDaVidaApplication.dtos.produto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record ProdutoRequestDto(
    @NotBlank(message = "O nome do produto é obrigatório") String nome,
    @NotNull(message = "A categoria é obrigatória") Long categoriaId,
    @NotBlank(message = "A unidade é obrigatória") String unidade,
    @NotNull(message = "O preço de venda é obrigatório") BigDecimal precoVenda,
    @NotNull(message = "O estoque é obrigatório") Integer estoque,
    @NotNull(message = "O estoque mínimo é obrigatório") Integer estoqueMinimo
) {}
