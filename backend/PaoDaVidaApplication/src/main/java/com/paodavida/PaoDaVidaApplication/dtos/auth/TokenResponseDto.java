package com.paodavida.PaoDaVidaApplication.dtos.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


public record TokenResponseDto(
        String token,
        long expiresIn
) {
}
