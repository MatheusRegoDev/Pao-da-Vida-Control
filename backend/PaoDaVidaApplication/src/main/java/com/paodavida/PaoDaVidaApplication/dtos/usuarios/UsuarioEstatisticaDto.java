package com.paodavida.PaoDaVidaApplication.dtos.usuarios;

public record UsuarioEstatisticaDto (
        long totalUsuarios,
        long usuariosAtivos,
        long usuariosInativos,
        long administradores
){
}
