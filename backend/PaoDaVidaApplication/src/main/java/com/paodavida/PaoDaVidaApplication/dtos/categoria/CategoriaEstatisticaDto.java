package com.paodavida.PaoDaVidaApplication.dtos.categoria;

public record CategoriaEstatisticaDto(
        long totalCategorias,
        long totalProdutos,
        String maiorCategoria,
        String ultimaCategoriaAdicionada
) {
}
