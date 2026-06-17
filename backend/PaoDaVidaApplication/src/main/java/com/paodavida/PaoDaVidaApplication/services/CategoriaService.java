package com.paodavida.PaoDaVidaApplication.services;

import com.paodavida.PaoDaVidaApplication.dtos.categoria.CategoriaRequestDto;
import com.paodavida.PaoDaVidaApplication.dtos.categoria.CategoriaResponseDto;
import com.paodavida.PaoDaVidaApplication.models.CategoriaModel;
import com.paodavida.PaoDaVidaApplication.repositories.CategoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriaService {

    private final CategoriaRepository repository;

    public CategoriaService(CategoriaRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public CategoriaResponseDto create(CategoriaRequestDto dto) {
        CategoriaModel model = new CategoriaModel();
        model.setNome(dto.nome());
        model.setDescricao(dto.descricao());
        model.setTotalProdutos(dto.totalProdutos());
        model = repository.save(model);
        return mapToDto(model);
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponseDto> findAll() {
        return repository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoriaResponseDto findById(Long id) {
        CategoriaModel model = repository.findById(id).orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        return mapToDto(model);
    }

    @Transactional
    public CategoriaResponseDto update(Long id, CategoriaRequestDto dto) {
        CategoriaModel model = repository.findById(id).orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        model.setNome(dto.nome());
        model.setDescricao(dto.descricao());
        model.setTotalProdutos(dto.totalProdutos());
        model = repository.save(model);
        return mapToDto(model);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Categoria não encontrada");
        }
        repository.deleteById(id);
    }

    public CategoriaResponseDto mapToDto(CategoriaModel model) {
        if (model == null) return null;
        return new CategoriaResponseDto(
            model.getId(),
            model.getNome(),
            model.getDescricao(),
            model.getTotalProdutos(),
            model.getCriadoEm()
        );
    }
}
