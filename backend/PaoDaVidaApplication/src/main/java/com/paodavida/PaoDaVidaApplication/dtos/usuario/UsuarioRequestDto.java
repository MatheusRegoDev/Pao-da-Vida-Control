package com.paodavida.PaoDaVidaApplication.dtos.usuario;

import com.paodavida.PaoDaVidaApplication.models.enums.CargoUsuario;
import com.paodavida.PaoDaVidaApplication.models.enums.StatusUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UsuarioRequestDto(
    @NotBlank(message = "O nome é obrigatório") String nome,
    @NotBlank(message = "O email é obrigatório") @Email(message = "Email inválido") String email,
    @NotNull(message = "O cargo é obrigatório") CargoUsuario cargo,
    String setor,
    @NotNull(message = "O status é obrigatório") StatusUsuario status,
    String avatar
) {}
