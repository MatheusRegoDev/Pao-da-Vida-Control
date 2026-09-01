package com.paodavida.PaoDaVidaApplication.controllers;

import com.paodavida.PaoDaVidaApplication.dtos.auth.LoginRequestDto;
import com.paodavida.PaoDaVidaApplication.dtos.auth.TokenResponseDto;
import com.paodavida.PaoDaVidaApplication.dtos.auth.UsuarioLogadoResposeDto;
import com.paodavida.PaoDaVidaApplication.models.UsuarioModel;
import com.paodavida.PaoDaVidaApplication.services.AutenticacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/me")
    public ResponseEntity<UsuarioLogadoResposeDto> me(){
        UsuarioModel usuario = (UsuarioModel) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UsuarioLogadoResposeDto usuarioLogadoResposeDto = new UsuarioLogadoResposeDto(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getCargoUsuario());
        return ResponseEntity.ok(usuarioLogadoResposeDto);
    }
}
