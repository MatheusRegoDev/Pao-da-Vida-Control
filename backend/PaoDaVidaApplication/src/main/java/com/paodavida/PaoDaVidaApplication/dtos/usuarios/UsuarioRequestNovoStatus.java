package com.paodavida.PaoDaVidaApplication.dtos.usuarios;

import lombok.Builder;

@Builder
public record UsuarioRequestNovoStatus(boolean novoStatus) {
}
