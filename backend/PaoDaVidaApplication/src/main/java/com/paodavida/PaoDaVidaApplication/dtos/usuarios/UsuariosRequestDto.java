package com.paodavida.PaoDaVidaApplication.dtos.usuarios;

import com.paodavida.PaoDaVidaApplication.models.enums.CargoUsuario;
import com.paodavida.PaoDaVidaApplication.models.enums.SetorUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;

@Builder
public record UsuariosRequestDto (
        @NotBlank(message = "O nome do usuário não pode ser nulo ou vazio")
        String nome,

        @Email(message = "O email do usuário deve ser válido")
        @NotBlank(message = "O email do usuário não pode ser nulo ou vazio")
        String email,

        @NotBlank(message = "A senha do usuário não pode ser nula ou vazia")
        @Pattern(
                regexp = "^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,}$",
                message = "Senha deve conter ao menos 1 número, 1 letra maiúscula e 1 caractere especial, com mínimo de 8 caracteres"
        )
        String senha,

        @NotNull(message = "O cargo do usuário não pode ser nulo")
        CargoUsuario cargoUsuario,

        @NotNull(message = "O setor do usuário não pode ser nulo")
        SetorUsuario setor,

        @NotNull(message = "O status do usuário não pode ser nulo")
        boolean status

){
}
