package com.paodavida.PaoDaVidaApplication.dtos.categoria;

import jakarta.validation.constraints.NotBlank;

public record CategoriaRequestDto(
        @NotBlank(message = "O nome da categoria não pode ser nulo ou vazio") String nome,
        String descricao
) {
}
