package com.paodavida.PaoDaVidaApplication.services;

import com.paodavida.PaoDaVidaApplication.dtos.produto.ProdutoRequestDto;
import com.paodavida.PaoDaVidaApplication.dtos.produto.ProdutoResponseDto;
import com.paodavida.PaoDaVidaApplication.models.CategoriaModel;
import com.paodavida.PaoDaVidaApplication.models.ProdutoModel;
import com.paodavida.PaoDaVidaApplication.repositories.CategoriaRepository;
import com.paodavida.PaoDaVidaApplication.repositories.ProdutoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProdutoService {

    private final ProdutoRepository repository;
    private final CategoriaRepository categoriaRepository;
    private final CategoriaService categoriaService;

    public ProdutoService(ProdutoRepository repository, CategoriaRepository categoriaRepository, CategoriaService categoriaService) {
        this.repository = repository;
        this.categoriaRepository = categoriaRepository;
        this.categoriaService = categoriaService;
    }

    @Transactional
    public ProdutoResponseDto create(ProdutoRequestDto dto) {
        ProdutoModel model = new ProdutoModel();
        model.setNome(dto.nome());
        model.setUnidade(dto.unidade());
        model.setPrecoVenda(dto.precoVenda());
        model.setEstoque(dto.estoque());
        model.setEstoqueMinimo(dto.estoqueMinimo());
        
        CategoriaModel categoria = categoriaRepository.findById(dto.categoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        model.setCategoria(categoria);
        
        model = repository.save(model);
        return mapToDto(model);
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponseDto> findAll() {
        return repository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProdutoResponseDto findById(Long id) {
        ProdutoModel model = repository.findById(id).orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        return mapToDto(model);
    }

    @Transactional
    public ProdutoResponseDto update(Long id, ProdutoRequestDto dto) {
        ProdutoModel model = repository.findById(id).orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        model.setNome(dto.nome());
        model.setUnidade(dto.unidade());
        model.setPrecoVenda(dto.precoVenda());
        model.setEstoque(dto.estoque());
        model.setEstoqueMinimo(dto.estoqueMinimo());
        
        CategoriaModel categoria = categoriaRepository.findById(dto.categoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        model.setCategoria(categoria);
        
        model = repository.save(model);
        return mapToDto(model);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Produto não encontrado");
        }
        repository.deleteById(id);
    }

    public ProdutoResponseDto mapToDto(ProdutoModel model) {
        if (model == null) return null;
        return new ProdutoResponseDto(
            model.getId(),
            model.getNome(),
            categoriaService.mapToDto(model.getCategoria()),
            model.getUnidade(),
            model.getPrecoVenda(),
            model.getEstoque(),
            model.getEstoqueMinimo(),
            model.getCriadoEm()
        );
    }
}
