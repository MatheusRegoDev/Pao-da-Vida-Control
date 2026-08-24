package com.paodavida.PaoDaVidaApplication.config;

import com.paodavida.PaoDaVidaApplication.Repositories.UsuarioRepository;
import com.paodavida.PaoDaVidaApplication.models.UsuarioModel;
import com.paodavida.PaoDaVidaApplication.models.enums.CargoUsuario;
import com.paodavida.PaoDaVidaApplication.models.enums.SetorUsuario;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.senha}")
    private String adminSenha;

    @Override
    public void run(String... args){

        if (usuarioRepository.existsByEmail(adminEmail)){
            System.out.println("Admin user already exists.");
        }

        UsuarioModel adminUser = UsuarioModel.builder()
                .nome("Admin")
                .email(adminEmail)
                .senha(passwordEncoder.encode(adminSenha))
                .cargoUsuario(CargoUsuario.ADMINISTRADOR)
                .setor(SetorUsuario.GESTÃO)
                .status(true)
                .dataCriacao(Instant.now())
                .build();

        usuarioRepository.save(adminUser);
        System.out.println("Usuário admin criado: " + adminEmail);
    }
}


