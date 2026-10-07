package com.paodavida.PaoDaVidaApplication.dtos.auth;

public record TokenResponseDto(
        String token,
        long expiresIn
) {
}
