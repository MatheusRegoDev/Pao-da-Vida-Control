package com.paodavida.PaoDaVidaApplication.controllers;

import com.paodavida.PaoDaVidaApplication.config.TokenService;
import com.paodavida.PaoDaVidaApplication.dtos.auth.AuthenticationDto;
import com.paodavida.PaoDaVidaApplication.dtos.auth.LoginResponseDto;
import com.paodavida.PaoDaVidaApplication.models.UsuarioModel;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public AuthController(AuthenticationManager authenticationManager, TokenService tokenService) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody @Valid AuthenticationDto data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.senha());
        var auth = this.authenticationManager.authenticate(usernamePassword);

        var token = tokenService.generateToken((UsuarioModel) auth.getPrincipal());

        return ResponseEntity.ok(new LoginResponseDto(token));
    }
}
