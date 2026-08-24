package com.paodavida.PaoDaVidaApplication.dtos.categoria;

import java.time.Instant;


public record CategoriaResponseDto(
        Long id,
        String nome,
        String descricao,
        Integer totalProdutos,
        boolean possuiProdutos,
        Instant dataCriacao
) {
}
