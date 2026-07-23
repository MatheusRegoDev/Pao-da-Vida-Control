package com.paodavida.PaoDaVidaApplication.dtos.produto;

import com.paodavida.PaoDaVidaApplication.models.enums.UnidadeMedida;

import java.math.BigDecimal;
import java.time.Instant;

public record ProdutoResponseDto(
        Long id,
        String nome,
        Long categoriaId,
        String categoriaNome,
        UnidadeMedida unidade,
        BigDecimal preco,
        BigDecimal estoque,
        BigDecimal estoqueMinimo,
        Instant dataCriacao

) {
}
