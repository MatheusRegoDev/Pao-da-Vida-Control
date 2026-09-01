package com.paodavida.PaoDaVidaApplication.dtos.auth;

import com.paodavida.PaoDaVidaApplication.models.enums.CargoUsuario;

import java.util.UUID;

public record UsuarioLogadoResposeDto(
        UUID id,
        String nome,
        String email,
        CargoUsuario Cargo
) {
}
