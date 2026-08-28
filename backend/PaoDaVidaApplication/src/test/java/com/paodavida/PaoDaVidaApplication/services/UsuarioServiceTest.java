
package com.paodavida.PaoDaVidaApplication.services;

import com.paodavida.PaoDaVidaApplication.Repositories.UsuarioRepository;
import com.paodavida.PaoDaVidaApplication.dtos.usuarios.*;
import com.paodavida.PaoDaVidaApplication.exception.NotFoundException;
import com.paodavida.PaoDaVidaApplication.exception.UsuarioDuplicadoException;
import com.paodavida.PaoDaVidaApplication.models.UsuarioModel;
import com.paodavida.PaoDaVidaApplication.models.enums.CargoUsuario;
import com.paodavida.PaoDaVidaApplication.models.enums.SetorUsuario;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.paodavida.PaoDaVidaApplication.models.enums.CargoUsuario.*;
        import static com.paodavida.PaoDaVidaApplication.models.enums.SetorUsuario.*;
        import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @InjectMocks
    private UsuarioService usuarioService;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private UsuarioModel usuarioModelExistente, usuarioModel1, usuarioModel2, usuarioModel3;
    private UsuariosRequestDto usuariosRequestDto;
    private UsuarioEstatisticaDto usuarioEstatisticaDto;
    private UsuarioRedefinirSenhaDto usuarioRedefinirSenhaDto;
    private UsuarioUpdateDto usuarioUpdateDto;
    private UsuarioRequestNovoStatus usuarioRequestNovoStatus;

    @BeforeEach
    void setUp() {
        usuarioModelExistente = UsuarioModel.builder()
                .id(UUID.fromString("f06a75a2-63e7-4acd-9f98-7d7e3a1ee6e2"))
                .nome("Maria Santos Nogueira")
                .email("mariasantos@exemplo.com")
                .senha(passwordEncoder.encode("Maria.Santos123"))
                .cargoUsuario(GERENTE)
                .setor(GESTAO)
                .status(true)
                .ultimoAcesso(null)
                .dataCriacao(Instant.now())
                .build();

        usuariosRequestDto = UsuariosRequestDto.builder()
                .nome("Maria Geovana Vital Klener")
                .email("mariageovana@exemplo.com")
                .senha(passwordEncoder.encode("Geovana.K123"))
                .cargoUsuario(OPERADOR)
                .setor(VENDAS)
                .status(true)
                .build();

        usuarioRedefinirSenhaDto = UsuarioRedefinirSenhaDto.builder()
                .novaSenha(passwordEncoder.encode("Santos.321"))
                .build();

        usuarioUpdateDto = UsuarioUpdateDto.builder()
                .nome("João Miguel Santos Drumond")
                .email("joaoDrumond26@exemplo.com")
                .cargo(VENDEDOR)
                .setor(VENDAS)
                .status(true)
                .build();

        usuarioRequestNovoStatus = UsuarioRequestNovoStatus.builder()
                .novoStatus(false)
                .build();

        usuarioModel1 = UsuarioModel.builder()
                .id(UUID.randomUUID())
                .nome("João Pedro Almeida")
                .email("joao.almeida@exemplo.com")
                .senha(passwordEncoder.encode("Joao.Pedro123"))
                .cargoUsuario(OPERADOR)
                .setor(VENDAS)
                .status(true)
                .ultimoAcesso(null)
                .dataCriacao(Instant.now())
                .build();

        usuarioModel2 = UsuarioModel.builder()
                .id(UUID.randomUUID())
                .nome("Ana Clara Souza")
                .email("ana.souza@exemplo.com")
                .senha(passwordEncoder.encode("Ana.Clara123"))
                .cargoUsuario(VENDEDOR)
                .setor(VENDAS)
                .status(true)
                .ultimoAcesso(null)
                .dataCriacao(Instant.now())
                .build();

        usuarioModel3 = UsuarioModel.builder()
                .id(UUID.randomUUID())
                .nome("Carlos Eduardo Lima")
                .email("carlos.lima@exemplo.com")
                .senha(passwordEncoder.encode("Carlos.Lima123"))
                .cargoUsuario(OPERADOR)
                .setor(FINANCEIRO)
                .status(true)
                .ultimoAcesso(null)
                .dataCriacao(Instant.now())
                .build();

    }


    @Test
    @DisplayName("Deve criar um novo usuário com sucesso")
    void create() {
        //Arrange
        when(usuarioRepository.existsByEmail(usuariosRequestDto.email())).thenReturn(false);
        when(usuarioRepository.save(any(UsuarioModel.class))).thenReturn(usuarioModelExistente);

        //Act
        var usuarioResultado = usuarioService.create(usuariosRequestDto);

        //Assert
        Assertions.assertEquals("Maria Santos Nogueira", usuarioResultado.nome());
        Assertions.assertEquals("mariasantos@exemplo.com", usuarioResultado.email());
    }

    @Test
    @DisplayName("Deve lançar uma exceção ao tentar criar um usuário com email duplicado")
    void createUsuarioComEmailDuplicado() {
        //Arrange
        when(usuarioRepository.existsByEmail(usuariosRequestDto.email())).thenReturn(true);

        //Act & Assert
        assertThrows(UsuarioDuplicadoException.class, () -> usuarioService.create(usuariosRequestDto));
    }

    @Test
    @DisplayName("Deve listar todos os Usuários")
    void findAll() {
        //Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<UsuarioModel> usuarioModelPagePage = new PageImpl<>(java.util.List.of(usuarioModel1, usuarioModel2, usuarioModel3), pageable, 3);

        when(usuarioRepository.findAll(pageable)).thenReturn(usuarioModelPagePage);
        // Act
        var resultado = usuarioService.findAll(pageable);
        // Assert
        Assertions.assertEquals(3, resultado.getTotalElements());
    }

    @Test
    @DisplayName("Deve retornar uma pagina de usuário buscado pelo filtro")
    void findByTermoCargoSetor() {
        //Arrange
        String termo = null;
        CargoUsuario cargo = OPERADOR;
        SetorUsuario setor = null;
        Pageable pageable = PageRequest.of(0, 10);

        Page<UsuarioModel> usuarioModelPagePage = new PageImpl<>(java.util.List.of(usuarioModel1, usuarioModel3), pageable, 2);

        when(usuarioRepository.buscarComFiltros(termo, cargo, setor, pageable))
                .thenReturn(usuarioModelPagePage);

        // act
        Page<UsuarioResponseDto> resultado = usuarioService.findByTermoCargoSetor(termo, cargo, setor, pageable);

        // assert
        assertThat(resultado).isNotNull();
        assertThat(resultado.getTotalElements()).isEqualTo(2);
        assertThat(resultado.getContent().get(1).cargoUsuario()).isEqualTo(OPERADOR); // ajuste se DTO não for record

        verify(usuarioRepository, times(1)).buscarComFiltros(termo, cargo, setor, pageable);
        verifyNoMoreInteractions(usuarioRepository);
    }

    @Test
    void deveRetornarPageVazioQuandoNenhumUsuarioAtenderFiltros() {
        // arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<UsuarioModel> pageVazio = new PageImpl<>(List.of(), pageable, 0);

        when(usuarioRepository.buscarComFiltros(any(), any(), any(), eq(pageable)))
                .thenReturn(pageVazio);

        // act
        Page<UsuarioResponseDto> resultado = usuarioService.findByTermoCargoSetor(null, null, null, pageable);

        // assert
        assertThat(resultado).isEmpty();
        assertThat(resultado.getTotalElements()).isZero();
    }


    @Test
    void findById() {
        // Arrange
        when(usuarioRepository.findById(UUID.fromString("f06a75a2-63e7-4acd-9f98-7d7e3a1ee6e2")))
                .thenReturn(Optional.of(usuarioModelExistente));

        // Act
        UsuarioResponseDto resultado = usuarioService.findById(UUID.fromString("f06a75a2-63e7-4acd-9f98-7d7e3a1ee6e2"));

        // Assert
        Assertions.assertEquals(usuarioModelExistente.getId(), resultado.id());
    }

    @Test
    void estatisticas() {
        // Arrange
        when(usuarioRepository.count()).thenReturn(10L);
        when(usuarioRepository.countByStatusTrue()).thenReturn(7L);
        when(usuarioRepository.countByStatusFalse()).thenReturn(3L);
        when(usuarioRepository.countByCargoUsuario(CargoUsuario.ADMINISTRADOR)).thenReturn(2L);

        // Act
        UsuarioEstatisticaDto resultado = usuarioService.estatisticas();

        // Assert
        assertThat(resultado.totalUsuarios()).isEqualTo(10L);
        assertThat(resultado.usuariosAtivos()).isEqualTo(7L);
        assertThat(resultado.usuariosInativos()).isEqualTo(3L);
        assertThat(resultado.administradores()).isEqualTo(2L);

        verify(usuarioRepository).count();
        verify(usuarioRepository).countByStatusTrue();
        verify(usuarioRepository).countByStatusFalse();
        verify(usuarioRepository).countByCargoUsuario(CargoUsuario.ADMINISTRADOR);
    }

    @Test
    void update() {
        // Arrange
        UUID id = usuarioModelExistente.getId();
        when(usuarioRepository.findById(id)).thenReturn(Optional.of(usuarioModelExistente));
        // email do dto é diferente do atual, então precisa checar existsByEmail
        when(usuarioRepository.existsByEmail(usuarioUpdateDto.email())).thenReturn(false);
        when(usuarioRepository.save(usuarioModelExistente)).thenReturn(usuarioModelExistente);

        // Act
        UsuarioResponseDto resultado = usuarioService.update(id, usuarioUpdateDto);

        // Assert
        assertThat(resultado.nome()).isEqualTo(usuarioUpdateDto.nome());
        assertThat(resultado.email()).isEqualTo(usuarioUpdateDto.email());
        assertThat(resultado.cargoUsuario()).isEqualTo(usuarioUpdateDto.cargo());
        assertThat(resultado.setor()).isEqualTo(usuarioUpdateDto.setor());
        assertThat(resultado.status()).isEqualTo(usuarioUpdateDto.status());

        verify(usuarioRepository).findById(id);
        verify(usuarioRepository).existsByEmail(usuarioUpdateDto.email());
        verify(usuarioRepository).save(usuarioModelExistente);
    }

    @Test
    @DisplayName("Deve lançar exceção ao atualizar com email já cadastrado por outro usuário")
    void updateComEmailDuplicadoDeveLancarExcecao() {
        // Arrange
        UUID id = usuarioModelExistente.getId();
        when(usuarioRepository.findById(id)).thenReturn(Optional.of(usuarioModelExistente));
        when(usuarioRepository.existsByEmail(usuarioUpdateDto.email())).thenReturn(true);

        // Act & Assert
        Assertions.assertThrows(UsuarioDuplicadoException.class,
                () -> usuarioService.update(id, usuarioUpdateDto));

        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar exceção ao atualizar usuário inexistente")
    void updateUsuarioInexistenteDeveLancarExcecao() {
        // Arrange
        UUID id = UUID.randomUUID();
        when(usuarioRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NotFoundException.class,
                () -> usuarioService.update(id, usuarioUpdateDto));

        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void redefinirSenha() {
        // Arrange
        UUID id = usuarioModelExistente.getId();
        String senhaCodificada = "senha-codificada-mock";
        when(usuarioRepository.findById(id)).thenReturn(Optional.of(usuarioModelExistente));
        when(passwordEncoder.encode(usuarioRedefinirSenhaDto.novaSenha())).thenReturn(senhaCodificada);

        // Act
        usuarioService.redefinirSenha(id, usuarioRedefinirSenhaDto);

        // Assert
        assertThat(usuarioModelExistente.getSenha()).isEqualTo(senhaCodificada);
        verify(usuarioRepository).save(usuarioModelExistente);
    }

    @Test
    @DisplayName("Deve lançar exceção ao redefinir senha de usuário inexistente")
    void redefinirSenhaUsuarioInexistenteDeveLancarExcecao() {
        // Arrange
        UUID id = UUID.randomUUID();
        when(usuarioRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NotFoundException.class,
                () -> usuarioService.redefinirSenha(id, usuarioRedefinirSenhaDto));

        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve alterar o status do usuário quando o novo status é diferente")
    void alterarStatus() {
        // Arrange
        UUID id = usuarioModelExistente.getId(); // status atual = true
        UsuarioRequestNovoStatus dto = UsuarioRequestNovoStatus.builder()
                .novoStatus(false)
                .build();

        when(usuarioRepository.findById(id)).thenReturn(Optional.of(usuarioModelExistente));
        when(usuarioRepository.save(usuarioModelExistente)).thenReturn(usuarioModelExistente);

        // Act
        UsuarioResponseDto resultado = usuarioService.alterarStatus(id, dto);

        // Assert
        assertThat(resultado.status()).isFalse();
        assertThat(usuarioModelExistente.isStatus()).isFalse();

        verify(usuarioRepository).findById(id);
        verify(usuarioRepository).save(usuarioModelExistente);
    }

    @Test
    @DisplayName("Não deve salvar quando o novo status é igual ao atual")
    void alterarStatusComMesmoStatusNaoDeveSalvar() {
        // Arrange
        UUID id = usuarioModelExistente.getId(); // status atual = true
        UsuarioRequestNovoStatus dto = UsuarioRequestNovoStatus.builder()
                .novoStatus(true)
                .build();

        when(usuarioRepository.findById(id)).thenReturn(Optional.of(usuarioModelExistente));

        // Act
        UsuarioResponseDto resultado = usuarioService.alterarStatus(id, dto);

        // Assert
        assertThat(resultado.status()).isTrue();

        verify(usuarioRepository).findById(id);
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar exceção ao alterar status de usuário inexistente")
    void alterarStatusUsuarioInexistenteDeveLancarExcecao() {
        // Arrange
        UUID id = UUID.randomUUID();
        UsuarioRequestNovoStatus dto = UsuarioRequestNovoStatus.builder()
                .novoStatus(false)
                .build();

        when(usuarioRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NotFoundException.class,
                () -> usuarioService.alterarStatus(id, dto));

        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve deletar o usuário quando ele existe")
    void delete() {
        // Arrange
        UUID id = usuarioModelExistente.getId();
        when(usuarioRepository.findById(id)).thenReturn(Optional.of(usuarioModelExistente));

        // Act
        usuarioService.delete(id);

        // Assert
        verify(usuarioRepository).findById(id);
        verify(usuarioRepository).delete(usuarioModelExistente);
    }

    @Test
    @DisplayName("Deve lançar exceção ao deletar usuário inexistente")
    void deleteUsuarioInexistenteDeveLancarExcecao() {
        // Arrange
        UUID id = UUID.randomUUID();
        when(usuarioRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NotFoundException.class,
                () -> usuarioService.delete(id));

        verify(usuarioRepository, never()).delete(any());
    }
}
