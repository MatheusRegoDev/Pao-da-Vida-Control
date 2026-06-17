package com.paodavida.PaoDaVidaApplication.dtos.produto;

import com.paodavida.PaoDaVidaApplication.dtos.categoria.CategoriaResponseDto;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProdutoResponseDto(
    Long id,
    String nome,
    CategoriaResponseDto categoria,
    String unidade,
    BigDecimal precoVenda,
    Integer estoque,
    Integer estoqueMinimo,
    LocalDateTime criadoEm
) {}
