package com.paodavida.PaoDaVidaApplication.dtos.usuario;

import com.paodavida.PaoDaVidaApplication.models.enums.CargoUsuario;
import com.paodavida.PaoDaVidaApplication.models.enums.StatusUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UsuarioRequestDto(
    @NotBlank(message = "O nome é obrigatório") String nome,
    @NotBlank(message = "O email é obrigatório") @Email(message = "Email inválido") String email,
    @NotBlank(message = "A senha é obrigatória") @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres") String senha,
    @NotNull(message = "O cargo é obrigatório") CargoUsuario cargo,
    String setor,
    @NotNull(message = "O status é obrigatório") StatusUsuario status,
    String avatar
) {}
