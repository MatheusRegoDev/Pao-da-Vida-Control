package com.paodavida.PaoDaVidaApplication.dtos.categoria;

import java.time.LocalDateTime;

public record CategoriaResponseDto(
    Long id,
    String nome,
    String descricao,
    Integer totalProdutos,
    LocalDateTime criadoEm
) {}
