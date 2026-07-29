package com.paodavida.PaoDaVidaApplication.dtos.usuarios;

import com.paodavida.PaoDaVidaApplication.models.enums.CargoUsuario;
import com.paodavida.PaoDaVidaApplication.models.enums.SetorUsuario;

import java.time.Instant;
import java.util.UUID;

public record UsuarioResponseDto(
    UUID id,
    String nome,
    String email,
    CargoUsuario cargoUsuario,
    SetorUsuario setor,
    boolean status,
    Instant ultimoAcesso,
    Instant dataCriacao
) {
}
