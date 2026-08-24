package com.paodavida.PaoDaVidaApplication.Repositories;

import com.paodavida.PaoDaVidaApplication.models.UsuarioModel;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.Optional;

import static com.paodavida.PaoDaVidaApplication.models.enums.CargoUsuario.GERENTE;
import static com.paodavida.PaoDaVidaApplication.models.enums.CargoUsuario.OPERADOR;
import static com.paodavida.PaoDaVidaApplication.models.enums.SetorUsuario.GESTÃO;
import static com.paodavida.PaoDaVidaApplication.models.enums.SetorUsuario.PRODUÇÃO;

@DataJpaTest
class UsuarioRepositoryTest {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @BeforeEach
    void setUp() {
        UsuarioModel usuarioModel = UsuarioModel.builder()
                .nome("Wesley Safadão")
                .email("wesleysadao@exemplo.com")
                .senha("Senha.123")
                .cargoUsuario(GERENTE)
                .setor(GESTÃO)
                .status(true)
                .ultimoAcesso(null)
                .dataCriacao(Instant.now())
                .build();

        usuarioRepository.save(usuarioModel);
    }

    @Test
    @DisplayName("Deve retornar um Usuário pelo e-mail informado")
    void findByEmail() {
        // Arrange
        String emailExistente = "wesleysadao@exemplo.com";

        // Act
        Optional<UsuarioModel> usuarioExistente = usuarioRepository.findByEmail(emailExistente);

        // Assert
        Assertions.assertTrue(usuarioExistente.isPresent());
        Assertions.assertEquals(emailExistente, usuarioExistente.get().getEmail());
    }

    @Test
    @DisplayName("Deve retornar true quando existir um usuário com o e-mail informado")
    void existsByEmail() {
        //Arrange
        String emailExistente = "wesleysadao@exemplo.com";

        //Act
        boolean usuarioExiste = usuarioRepository.existsByEmail(emailExistente);

        //Assert
        Assertions.assertTrue(usuarioExiste);

    }

    @Test
    @DisplayName("Deve buscar usuários com filtros aplicados por termo")
    void buscarComFiltrosPorTermo() {
        // Arrange
        String termo = "wesley";
        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<UsuarioModel> resultado = usuarioRepository.buscarComFiltros(termo, null, null, pageable);

        // Assert
        Assertions.assertEquals(1, resultado.getTotalElements());
        Assertions.assertEquals("wesleysadao@exemplo.com", resultado.getContent().get(0).getEmail());
    }

    @Test
    @DisplayName("Deve buscar usuários com filtro de cargo aplicado")
    void buscarComFiltrosPorCargo() {
        // Arrange
        usuarioRepository.save(
                UsuarioModel.builder()
                        .nome("Ana Lima")
                        .email("ana.lima@exemplo.com")
                        .senha("Senha.123")
                        .cargoUsuario(OPERADOR)
                        .setor(PRODUÇÃO)
                        .status(true)
                        .dataCriacao(Instant.now())
                        .build()
        );
        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<UsuarioModel> resultado = usuarioRepository.buscarComFiltros(null, GERENTE, null, pageable);

        // Assert
        Assertions.assertEquals(1, resultado.getTotalElements());
        Assertions.assertEquals(GERENTE, resultado.getContent().get(0).getCargoUsuario());
    }

    @Test
    @DisplayName("Deve retornar página vazia quando nenhum usuário atender aos filtros")
    void buscarComFiltrosSemResultados() {
        // Arrange
        String termoInexistente = "naoexiste";
        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<UsuarioModel> resultado = usuarioRepository.buscarComFiltros(termoInexistente, null, null, pageable);

        // Assert
        Assertions.assertTrue(resultado.isEmpty());
    }

    @Test
    @DisplayName("Deve contar corretamente os usuários com status status")
    void countByStatusTrue() {
        // Arrange
        usuarioRepository.save(
                UsuarioModel.builder()
                        .nome("Roberto Costa")
                        .email("roberto.costa@exemplo.com")
                        .senha("Senha.123")
                        .cargoUsuario(OPERADOR)
                        .setor(PRODUÇÃO)
                        .status(false)
                        .dataCriacao(Instant.now())
                        .build()
        );

        // Act
        long ativos = usuarioRepository.countByStatusTrue();

        // Assert
        Assertions.assertEquals(1, ativos);
    }

    @Test
    @DisplayName("Deve contar corretamente os usuários com status inativo")
    void countByStatusFalse() {
        // Arrange
        usuarioRepository.save(
                UsuarioModel.builder()
                        .nome("Roberto Costa")
                        .email("roberto.costa@exemplo.com")
                        .senha("Senha.123")
                        .cargoUsuario(OPERADOR)
                        .setor(PRODUÇÃO)
                        .status(false)
                        .dataCriacao(Instant.now())
                        .build()
        );

        // Act
        long inativos = usuarioRepository.countByStatusFalse();

        // Assert
        Assertions.assertEquals(1, inativos);
    }

    @Test
    @DisplayName("Deve contar corretamente os usuários por cargo")
    void countByCargoUsuario() {
        // Arrange
        usuarioRepository.save(
                UsuarioModel.builder()
                        .nome("Ana Lima")
                        .email("ana.lima@exemplo.com")
                        .senha("Senha.123")
                        .cargoUsuario(OPERADOR)
                        .setor(PRODUÇÃO)
                        .status(true)
                        .dataCriacao(Instant.now())
                        .build()
        );
        usuarioRepository.save(
                UsuarioModel.builder()
                        .nome("João Pereira")
                        .email("joao.pereira@exemplo.com")
                        .senha("Senha.123")
                        .cargoUsuario(OPERADOR)
                        .setor(PRODUÇÃO)
                        .status(true)
                        .dataCriacao(Instant.now())
                        .build()
        );

        // Act
        long operadores = usuarioRepository.countByCargoUsuario(OPERADOR);
        long gerentes = usuarioRepository.countByCargoUsuario(GERENTE);

        // Assert
        Assertions.assertEquals(2, operadores);
        Assertions.assertEquals(1, gerentes);
    }
}