package com.paodavida.PaoDaVidaApplication.dtos.usuarios;

import com.paodavida.PaoDaVidaApplication.models.enums.CargoUsuario;
import com.paodavida.PaoDaVidaApplication.models.enums.SetorUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record UsuarioUpdateDto(
        @NotBlank(message = "Nome é obrigatório")
        String nome,

        @NotBlank @Email(message = "Email inválido")
        String email,

        @NotNull(message = "Cargo é obrigatório")
        CargoUsuario cargoUsuario,

        @NotNull(message = "Setor é obrigatório")
        SetorUsuario setor,

        @NotNull(message = "Status é obrigatório")
        boolean status
) {
}
