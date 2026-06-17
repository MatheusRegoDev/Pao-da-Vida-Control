package com.paodavida.PaoDaVidaApplication.dtos.usuario;

import com.paodavida.PaoDaVidaApplication.models.enums.CargoUsuario;
import com.paodavida.PaoDaVidaApplication.models.enums.StatusUsuario;
import java.time.LocalDateTime;

public record UsuarioResponseDto(
    Long id,
    String nome,
    String email,
    CargoUsuario cargo,
    String setor,
    StatusUsuario status,
    LocalDateTime ultimoAcesso,
    LocalDateTime criadoEm,
    String avatar
) {}
