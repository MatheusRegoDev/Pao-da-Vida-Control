package com.paodavida.PaoDaVidaApplication.services;

import com.paodavida.PaoDaVidaApplication.Repositories.ProdutoRepository;
import com.paodavida.PaoDaVidaApplication.Repositories.UsuarioRepository;
import com.paodavida.PaoDaVidaApplication.dtos.usuarios.*;
import com.paodavida.PaoDaVidaApplication.exception.NotFoundException;
import com.paodavida.PaoDaVidaApplication.exception.UsuarioDuplicadoException;
import com.paodavida.PaoDaVidaApplication.models.UsuarioModel;
import com.paodavida.PaoDaVidaApplication.models.enums.CargoUsuario;
import com.paodavida.PaoDaVidaApplication.models.enums.SetorUsuario;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProdutoRepository produtoRepository;

    @Transactional
    public UsuarioResponseDto create(UsuariosRequestDto usuarioRequestDto) {
        if(usuarioRepository.existsByEmail(usuarioRequestDto.email())) {
            throw new UsuarioDuplicadoException("Email já cadastrado");
        }

        UsuarioModel usuarioModel = UsuarioModel.builder()
                .nome(usuarioRequestDto.nome())
                .email(usuarioRequestDto.email())
                .senha(passwordEncoder.encode(usuarioRequestDto.senha()))
                .cargoUsuario(usuarioRequestDto.cargoUsuario())
                .setor(usuarioRequestDto.setor())
                .status(true)
                .ultimoAcesso(null)
                .dataCriacao(Instant.now())
                .build();

        UsuarioModel usuarioSalvo = usuarioRepository.save(usuarioModel);

        return mapToResponseDto(usuarioSalvo);

    }

    @Transactional(readOnly = true)
    public Page<UsuarioResponseDto> findAll(Pageable pageable){
        return usuarioRepository.findAll(pageable)
                .map(this::mapToResponseDto);
    }

    @Transactional(readOnly = true)
    public Page<UsuarioResponseDto> findByTermoCargoSetor(String termo, CargoUsuario cargo, SetorUsuario setor, Pageable pageable) {
        return usuarioRepository.buscarComFiltros(termo, cargo, setor, pageable)
                .map(this::mapToResponseDto);
    }

    @Transactional(readOnly = true)
    public UsuarioResponseDto findById(UUID id) {
        return usuarioRepository.findById(id)
                .map(this::mapToResponseDto)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado com o ID: " + id));
    }

    public UsuarioEstatisticaDto estatisticas() {
        long total = usuarioRepository.count();
        long ativos = usuarioRepository.countByStatusTrue();
        long inativos = usuarioRepository.countByStatusFalse();
        long admins = usuarioRepository.countByCargoUsuario(CargoUsuario.ADMINISTRADOR);
        return new UsuarioEstatisticaDto(total, ativos, inativos, admins);
    }

    @Transactional
    public UsuarioResponseDto update(UUID id, UsuarioUpdateDto dto) {
        UsuarioModel usuarioModel = usuarioRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado com o ID: " + id));

        if (!usuarioModel.getEmail().equals(dto.email()) && usuarioRepository.existsByEmail(dto.email())) {
            throw new UsuarioDuplicadoException("Email já cadastrado");
        }

        usuarioModel.setNome(dto.nome());
        usuarioModel.setEmail(dto.email());
        usuarioModel.setCargoUsuario(dto.cargoUsuario());
        usuarioModel.setSetor(dto.setor());
        usuarioModel.setStatus(dto.status());

        UsuarioModel usuarioAtualizado = usuarioRepository.save(usuarioModel);

        return mapToResponseDto(usuarioAtualizado);
    }

    @Transactional
    public void redefinirSenha(UUID id, UsuarioRedefinirSenhaDto dto) {
        UsuarioModel usuarioModel = usuarioRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado com o ID: " + id));

        usuarioModel.setSenha(passwordEncoder.encode(dto.novaSenha()));
        usuarioRepository.save(usuarioModel);
    }

    @Transactional
    public UsuarioResponseDto alterarStatus(UUID id, UsuarioRequestNovoStatus novoStatus) {
        UsuarioModel usuarioModel = usuarioRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado com o ID: " + id));

        if (usuarioModel.isStatus() == novoStatus.novoStatus()) {
            return mapToResponseDto(usuarioModel);
        }

        usuarioModel.setStatus(novoStatus.novoStatus());
        UsuarioModel usuarioAtualizado = usuarioRepository.save(usuarioModel);

        return mapToResponseDto(usuarioAtualizado);
    }

    @Transactional
    public void delete(UUID id) {
        UsuarioModel usuarioModel = usuarioRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado com o ID: " + id));

        usuarioRepository.delete(usuarioModel);
    }

    private UsuarioResponseDto mapToResponseDto(UsuarioModel usuarioModel) {
        return new UsuarioResponseDto(
                usuarioModel.getId(),
                usuarioModel.getNome(),
                usuarioModel.getEmail(),
                usuarioModel.getCargoUsuario(),
                usuarioModel.getSetor(),
                usuarioModel.isStatus(),
                usuarioModel.getUltimoAcesso(),
                usuarioModel.getDataCriacao()
        );
    }
}
