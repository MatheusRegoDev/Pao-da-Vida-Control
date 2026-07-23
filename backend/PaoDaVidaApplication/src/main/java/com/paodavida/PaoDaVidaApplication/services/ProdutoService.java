package com.paodavida.PaoDaVidaApplication.services;

import com.paodavida.PaoDaVidaApplication.Repositories.ProdutoRepository;
import com.paodavida.PaoDaVidaApplication.Repositories.CategoriaRepository;
import com.paodavida.PaoDaVidaApplication.dtos.produto.ProdutoRequestDto;
import com.paodavida.PaoDaVidaApplication.dtos.produto.ProdutoResponseDto;
import com.paodavida.PaoDaVidaApplication.exception.NotFoundException;
import com.paodavida.PaoDaVidaApplication.exception.ProdutoDuplicadoException;
import com.paodavida.PaoDaVidaApplication.exception.UnidadeMedidaException;
import com.paodavida.PaoDaVidaApplication.models.ProdutoModel;
import com.paodavida.PaoDaVidaApplication.models.CategoriaModel;
import com.paodavida.PaoDaVidaApplication.models.enums.UnidadeMedida;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProdutoService(ProdutoRepository produtoRepository, CategoriaRepository categoriaRepository) {
        this.produtoRepository = produtoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional
    public ProdutoResponseDto create(ProdutoRequestDto produtoRequestDto) {
        if (produtoRepository.existsByNome(produtoRequestDto.nome())) {
            throw new ProdutoDuplicadoException("Já existe um produto com o nome: " + produtoRequestDto.nome());
        }

        CategoriaModel categoria = categoriaRepository.findById(produtoRequestDto.categoriaId())
                .orElseThrow(() -> new NotFoundException("Categoria não encontrada"));

        UnidadeMedida unidade = produtoRequestDto.unidade();

        // Se a unidade não for fracionável, garantir que estoque e estoqueMinimo sejam inteiros
        if (!unidade.isFracionavel()) {
            BigDecimal estoque = produtoRequestDto.estoque();
            BigDecimal estoqueMinimo = produtoRequestDto.estoqueMinimo();

            boolean estoqueFracionado = estoque.stripTrailingZeros().scale() > 0;
            boolean estoqueMinimoFracionado = estoqueMinimo.stripTrailingZeros().scale() > 0;

            if (estoqueFracionado || estoqueMinimoFracionado) {
                throw new UnidadeMedidaException("Unidade de medida não permite quantidades fracionárias");
            }
        }

        ProdutoModel produto = ProdutoModel.builder()
                .nome(produtoRequestDto.nome())
                .categoria(categoria)
                .unidade(produtoRequestDto.unidade())
                .preco(produtoRequestDto.preco())
                .estoque(produtoRequestDto.estoque())
                .estoqueMinimo(produtoRequestDto.estoqueMinimo())
                .build();

        ProdutoModel savedProduto = produtoRepository.save(produto);

        // Incrementa o total de produtos na categoria
        Integer total = categoria.getTotalProdutos();
        categoria.setTotalProdutos((total == null ? 0 : total) + 1);
        categoriaRepository.save(categoria);

        return mapToResponseDto(savedProduto);
    }

    @Transactional(readOnly = true)
    public Page<ProdutoResponseDto> findAll(Pageable pageable) {
        return produtoRepository.findAll(pageable)
                .map(this::mapToResponseDto);
    }

    @Transactional(readOnly = true)
    public ProdutoResponseDto findById(Long id) {
        return produtoRepository.findById(id)
                .map(this::mapToResponseDto)
                .orElseThrow(() -> new NotFoundException("Produto não encontrado"));
    }

    @Transactional
    public ProdutoResponseDto update(Long id, ProdutoRequestDto produtoRequestDto) {
        ProdutoModel produtoModel = produtoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Produto não encontrado"));

        CategoriaModel categoria = categoriaRepository.findById(produtoRequestDto.categoriaId())
                .orElseThrow(() -> new NotFoundException("Categoria não encontrada"));

        UnidadeMedida unidade = produtoRequestDto.unidade();

        // Se a unidade não for fracionável, garantir que estoque e estoqueMinimo sejam inteiros
        if (!unidade.isFracionavel()) {
            BigDecimal estoque = produtoRequestDto.estoque();
            BigDecimal estoqueMinimo = produtoRequestDto.estoqueMinimo();

            boolean estoqueFracionado = estoque.stripTrailingZeros().scale() > 0;
            boolean estoqueMinimoFracionado = estoqueMinimo.stripTrailingZeros().scale() > 0;

            if (estoqueFracionado || estoqueMinimoFracionado) {
                throw new UnidadeMedidaException("Unidade de medida não permite quantidades fracionárias");
            }
        }

        produtoModel.setNome(produtoRequestDto.nome());
        produtoModel.setCategoria(categoria);
        produtoModel.setUnidade(produtoRequestDto.unidade());
        produtoModel.setPreco(produtoRequestDto.preco());
        produtoModel.setEstoque(produtoRequestDto.estoque());
        produtoModel.setEstoqueMinimo(produtoRequestDto.estoqueMinimo());

        ProdutoModel updatedProduto = produtoRepository.save(produtoModel);
        return mapToResponseDto(updatedProduto);
    }

    @Transactional
    public void delete(Long id) {
        ProdutoModel produtoModel = produtoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Produto não encontrado"));

        // Decrementa o total de produtos na categoria
        CategoriaModel categoria = produtoModel.getCategoria();
        Integer total = categoria.getTotalProdutos();
        categoria.setTotalProdutos((total == null || total <= 0) ? 0 : total - 1);
        categoriaRepository.save(categoria);

        produtoRepository.delete(produtoModel);
    }

    public ProdutoResponseDto mapToResponseDto (ProdutoModel produtoModel) {

        return new ProdutoResponseDto(
                produtoModel.getId(),
                produtoModel.getNome(),
                produtoModel.getCategoria().getId(),
                produtoModel.getCategoria().getNome(),
                produtoModel.getUnidade(),
                produtoModel.getPreco(),
                produtoModel.getEstoque(),
                produtoModel.getEstoqueMinimo(),
                produtoModel.getDataCriacao()
        );
    }
}
