package com.paodavida.PaoDaVidaApplication.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    private String error;
    private String mensagem;
    private int status;
    private Instant timestamp;
    private Long totalProdutosVinculados;
}
