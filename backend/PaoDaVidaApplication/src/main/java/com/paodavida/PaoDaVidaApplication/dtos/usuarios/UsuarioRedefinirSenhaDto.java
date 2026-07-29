package com.paodavida.PaoDaVidaApplication.dtos.usuarios;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;

@Builder
public record UsuarioRedefinirSenhaDto(
        @NotBlank
        @Pattern(
                regexp = "^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,}$",
                message = "Senha deve conter ao menos 1 número, 1 letra maiúscula e 1 caractere especial"
        )
        String novaSenha
) {
}
