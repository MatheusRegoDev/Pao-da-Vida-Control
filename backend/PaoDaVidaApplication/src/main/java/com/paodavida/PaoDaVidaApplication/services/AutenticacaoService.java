package com.paodavida.PaoDaVidaApplication.services;

import com.paodavida.PaoDaVidaApplication.config.TokenProvider;
import com.paodavida.PaoDaVidaApplication.dtos.auth.LoginRequestDto;
import com.paodavida.PaoDaVidaApplication.dtos.auth.TokenResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AutenticacaoService {

    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;

    @Value("${jwt.expiration}")
    private long expiration;

    public TokenResponseDto login(LoginRequestDto loginRequestDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDto.email(),
                        loginRequestDto.senha()
                )
        );

        String token = tokenProvider.gerarToken(authentication);

        return new TokenResponseDto(token, expiration);
    }
}
