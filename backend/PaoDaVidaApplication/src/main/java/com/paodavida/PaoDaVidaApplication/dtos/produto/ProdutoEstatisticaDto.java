package com.paodavida.PaoDaVidaApplication.dtos.produto;

import java.math.BigDecimal;

public record ProdutoEstatisticaDto(
        Long totalProdutos,
        Long categoriasAtivas,
        BigDecimal valorTotalEstoque,
        long estoqueCritico
) {
}
