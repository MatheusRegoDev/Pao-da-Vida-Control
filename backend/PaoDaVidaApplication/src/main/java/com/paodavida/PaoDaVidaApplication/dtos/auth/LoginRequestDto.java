package com.paodavida.PaoDaVidaApplication.dtos.auth;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDto(
        @NotBlank(message = "Email é obrigatório")
        String email,
        @NotBlank(message = "Senha é obrigatória")
        String senha
) {
}
