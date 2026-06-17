package com.paodavida.PaoDaVidaApplication.dtos.entrada;

import com.paodavida.PaoDaVidaApplication.dtos.produto.ProdutoResponseDto;
import java.time.LocalDateTime;

public record EntradaResponseDto(
    Long id,
    ProdutoResponseDto produto,
    Integer quantidade,
    LocalDateTime data,
    String observacao,
    String responsavel
) {}
