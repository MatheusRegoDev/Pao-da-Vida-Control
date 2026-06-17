package com.paodavida.PaoDaVidaApplication.dtos.saida;

import com.paodavida.PaoDaVidaApplication.dtos.produto.ProdutoResponseDto;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SaidaResponseDto(
    Long id,
    ProdutoResponseDto produto,
    Integer quantidade,
    BigDecimal valorUnitario,
    BigDecimal valorTotal,
    LocalDateTime data,
    String observacao,
    String responsavel
) {}
