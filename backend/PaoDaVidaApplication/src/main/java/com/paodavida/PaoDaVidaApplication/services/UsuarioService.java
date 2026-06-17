package com.paodavida.PaoDaVidaApplication.services;

import com.paodavida.PaoDaVidaApplication.dtos.usuario.UsuarioRequestDto;
import com.paodavida.PaoDaVidaApplication.dtos.usuario.UsuarioResponseDto;
import com.paodavida.PaoDaVidaApplication.models.UsuarioModel;
import com.paodavida.PaoDaVidaApplication.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public UsuarioResponseDto create(UsuarioRequestDto dto) {
        UsuarioModel model = new UsuarioModel();
        model.setNome(dto.nome());
        model.setEmail(dto.email());
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
        UsuarioModel model = repository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return mapToDto(model);
    }

    @Transactional
    public UsuarioResponseDto update(Long id, UsuarioRequestDto dto) {
        UsuarioModel model = repository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        model.setNome(dto.nome());
        model.setEmail(dto.email());
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
            throw new RuntimeException("Usuário não encontrado");
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
