package com.paodavida.PaoDaVidaApplication.services;

import com.paodavida.PaoDaVidaApplication.Repositories.CategoriaRepository;
import com.paodavida.PaoDaVidaApplication.Repositories.ProdutoRepository;
import com.paodavida.PaoDaVidaApplication.dtos.categoria.CategoriaEstatisticaDto;
import com.paodavida.PaoDaVidaApplication.dtos.categoria.CategoriaRequestDto;
import com.paodavida.PaoDaVidaApplication.dtos.categoria.CategoriaResponseDto;
import com.paodavida.PaoDaVidaApplication.exception.CategoriaComProdutosException;
import com.paodavida.PaoDaVidaApplication.exception.CategoriaDuplicadaException;
import com.paodavida.PaoDaVidaApplication.exception.NotFoundException;
import com.paodavida.PaoDaVidaApplication.models.CategoriaModel;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final ProdutoRepository produtoRepository;

    public CategoriaService(CategoriaRepository categoriaRepository, ProdutoRepository produtoRepository) {
        this.categoriaRepository = categoriaRepository;
        this.produtoRepository = produtoRepository;
    }

    @Transactional
    public CategoriaResponseDto create(CategoriaRequestDto categoriaRequestDto) {
        if (categoriaRepository.existsByNome(categoriaRequestDto.nome())) {
            throw new CategoriaDuplicadaException("Já existe uma categoria com o nome: " + categoriaRequestDto.nome());
        }

        CategoriaModel categoriaModel = CategoriaModel.builder()
                .nome(categoriaRequestDto.nome())
                .descricao(categoriaRequestDto.descricao())
                .totalProdutos(0)
                .build();

        CategoriaModel savedCategoria = categoriaRepository.save(categoriaModel);
        return mapToResponseDto(savedCategoria);
    }


    @Transactional(readOnly = true)
    public Page<CategoriaResponseDto> findAll(String nome, Pageable pageable) {
        Page<CategoriaModel> categorias = (nome == null || nome.isBlank())
                ? categoriaRepository.findAll(pageable)
                : categoriaRepository.findByNomeContainingIgnoreCase(nome, pageable);
        return categorias.map(this::mapToResponseDto);
    }

    @Transactional(readOnly = true)
    public CategoriaResponseDto findById(Long id) {
        return categoriaRepository.findById(id)
                .map(this::mapToResponseDto)
                .orElseThrow(() -> new NotFoundException("Categoria não encontrada"));
    }

    @Transactional
    public CategoriaResponseDto update(Long id, CategoriaRequestDto categoriaRequestDto) {
        CategoriaModel categoriaModel = categoriaRepository.findById(id).orElseThrow(() -> new NotFoundException("Categoria não encontrada"));

        categoriaModel.setNome(categoriaRequestDto.nome());
        categoriaModel.setDescricao(categoriaRequestDto.descricao());

        CategoriaModel updatedCategoria = categoriaRepository.save(categoriaModel);
        return mapToResponseDto(updatedCategoria);
    }

    @Transactional
    public void delete(Long id, boolean forcar) {
        CategoriaModel categoriaModel = categoriaRepository.findById(id).orElseThrow(() -> new NotFoundException("Categoria não encontrada"));

        long totalProdutos = produtoRepository.countByCategoriaId(id);
        if (totalProdutos > 0 && !forcar) {
            throw new CategoriaComProdutosException(
                    "Existem " + totalProdutos + " produto(s) vinculados a esta categoria",
                    totalProdutos
            );
        }
        if (totalProdutos > 0) {
            produtoRepository.deleteAllByCategoriaId(id);
        }

        categoriaRepository.delete(categoriaModel);
    }


    public CategoriaResponseDto mapToResponseDto(CategoriaModel categoriaModel) {

        Integer totalProdutos = categoriaModel.getTotalProdutos();

        return new CategoriaResponseDto(
                categoriaModel.getId(),
                categoriaModel.getNome(),
                categoriaModel.getDescricao(),
                totalProdutos,
                totalProdutos != null && totalProdutos > 0,
                categoriaModel.getDataCriacao()
        );
    }

    public CategoriaEstatisticaDto estatisticas() {

        long totalCategorias = categoriaRepository.count();
        long totalProdutos = categoriaRepository.countCategoriasComProdutos();
        String maiorCategoria = categoriaRepository.findTopByOrderByTotalProdutosDesc()
                .map(CategoriaModel::getNome)
                .orElse("Nenhuma categoria");
        String ultimaCategoriaAdicionada = categoriaRepository.findFirstByOrderByDataCriacaoDesc()
                .map(CategoriaModel::getNome)
                .orElse("Nenhuma categoria");

        return new CategoriaEstatisticaDto(totalCategorias, totalProdutos, maiorCategoria, ultimaCategoriaAdicionada);
    }
}
