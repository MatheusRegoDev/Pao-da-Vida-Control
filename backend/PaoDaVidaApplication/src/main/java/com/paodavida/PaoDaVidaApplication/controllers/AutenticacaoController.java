package com.paodavida.PaoDaVidaApplication.controllers;

import com.paodavida.PaoDaVidaApplication.dtos.auth.LoginRequestDto;
import com.paodavida.PaoDaVidaApplication.dtos.auth.TokenResponseDto;
import com.paodavida.PaoDaVidaApplication.services.AutenticacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AutenticacaoController {

    private final AutenticacaoService autenticacaoService;

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDto> login(@RequestBody @Valid LoginRequestDto loginRequestDto) {
        TokenResponseDto tokenResponseDto = autenticacaoService.login(loginRequestDto);
        return ResponseEntity.ok(tokenResponseDto);
    }
}
