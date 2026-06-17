package com.paodavida.PaoDaVidaApplication.services;

import com.paodavida.PaoDaVidaApplication.dtos.usuario.UsuarioRequestDto;
import com.paodavida.PaoDaVidaApplication.dtos.usuario.UsuarioResponseDto;
import com.paodavida.PaoDaVidaApplication.exceptions.ResourceNotFoundException;
import com.paodavida.PaoDaVidaApplication.models.UsuarioModel;
import com.paodavida.PaoDaVidaApplication.repositories.UsuarioRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository repository, @Lazy PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UsuarioResponseDto create(UsuarioRequestDto dto) {
        UsuarioModel model = new UsuarioModel();
        model.setNome(dto.nome());
        model.setEmail(dto.email());
        model.setSenha(passwordEncoder.encode(dto.senha()));
        model.setCargo(dto.cargo());
        model.setSetor(dto.setor());
        model.setStatus(dto.status());
        model.setAvatar(dto.avatar());
        
        model = repository.save(model);
        return mapToDto(model);
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponseDto> findAll() {
        return repository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UsuarioResponseDto findById(Long id) {
        UsuarioModel model = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        return mapToDto(model);
    }

    @Transactional
    public UsuarioResponseDto update(Long id, UsuarioRequestDto dto) {
        UsuarioModel model = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        model.setNome(dto.nome());
        model.setEmail(dto.email());
        // Apenas atualiza a senha se ela vier diferente ou se a lógica do negócio permitir, aqui vamos sobrescrever a senha sempre.
        // Em um cenário real, teria um endpoint específico para trocar senha.
        model.setSenha(passwordEncoder.encode(dto.senha()));
        model.setCargo(dto.cargo());
        model.setSetor(dto.setor());
        model.setStatus(dto.status());
        model.setAvatar(dto.avatar());
        
        model = repository.save(model);
        return mapToDto(model);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Usuário não encontrado");
        }
        repository.deleteById(id);
    }

    private UsuarioResponseDto mapToDto(UsuarioModel model) {
        return new UsuarioResponseDto(
            model.getId(),
            model.getNome(),
            model.getEmail(),
            model.getCargo(),
            model.getSetor(),
            model.getStatus(),
            model.getUltimoAcesso(),
            model.getCriadoEm(),
            model.getAvatar()
        );
    }
}
