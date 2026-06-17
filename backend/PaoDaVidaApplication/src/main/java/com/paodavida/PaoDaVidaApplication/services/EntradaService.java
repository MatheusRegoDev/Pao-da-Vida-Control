package com.paodavida.PaoDaVidaApplication.services;

import com.paodavida.PaoDaVidaApplication.dtos.entrada.EntradaRequestDto;
import com.paodavida.PaoDaVidaApplication.dtos.entrada.EntradaResponseDto;
import com.paodavida.PaoDaVidaApplication.models.EntradaModel;
import com.paodavida.PaoDaVidaApplication.models.ProdutoModel;
import com.paodavida.PaoDaVidaApplication.repositories.EntradaRepository;
import com.paodavida.PaoDaVidaApplication.repositories.ProdutoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EntradaService {

    private final EntradaRepository repository;
    private final ProdutoRepository produtoRepository;
    private final ProdutoService produtoService;

    public EntradaService(EntradaRepository repository, ProdutoRepository produtoRepository, ProdutoService produtoService) {
        this.repository = repository;
        this.produtoRepository = produtoRepository;
        this.produtoService = produtoService;
    }

    @Transactional
    public EntradaResponseDto create(EntradaRequestDto dto) {
        EntradaModel model = new EntradaModel();
        model.setQuantidade(dto.quantidade());
        model.setObservacao(dto.observacao());
        model.setResponsavel(dto.responsavel());
        
        ProdutoModel produto = produtoRepository.findById(dto.produtoId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        model.setProduto(produto);
        
        // Atualiza estoque
        produto.setEstoque(produto.getEstoque() + dto.quantidade());
        produtoRepository.save(produto);
        
        model = repository.save(model);
        return mapToDto(model);
    }

    @Transactional(readOnly = true)
    public List<EntradaResponseDto> findAll() {
        return repository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EntradaResponseDto findById(Long id) {
        EntradaModel model = repository.findById(id).orElseThrow(() -> new RuntimeException("Entrada não encontrada"));
        return mapToDto(model);
    }

    @Transactional
    public EntradaResponseDto update(Long id, EntradaRequestDto dto) {
        EntradaModel model = repository.findById(id).orElseThrow(() -> new RuntimeException("Entrada não encontrada"));
        
        ProdutoModel produto = produtoRepository.findById(dto.produtoId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        
        // Ajusta estoque com a diferença
        int diferenca = dto.quantidade() - model.getQuantidade();
        if(model.getProduto().getId().equals(produto.getId())) {
            produto.setEstoque(produto.getEstoque() + diferenca);
            produtoRepository.save(produto);
        } else {
            // Se mudou de produto, reverte no antigo e adiciona no novo
            ProdutoModel antigo = model.getProduto();
            antigo.setEstoque(antigo.getEstoque() - model.getQuantidade());
            produtoRepository.save(antigo);
            
            produto.setEstoque(produto.getEstoque() + dto.quantidade());
            produtoRepository.save(produto);
        }

        model.setProduto(produto);
        model.setQuantidade(dto.quantidade());
        model.setObservacao(dto.observacao());
        model.setResponsavel(dto.responsavel());
        
        model = repository.save(model);
        return mapToDto(model);
    }

    @Transactional
    public void delete(Long id) {
        EntradaModel model = repository.findById(id).orElseThrow(() -> new RuntimeException("Entrada não encontrada"));
        
        // Reverte estoque
        ProdutoModel produto = model.getProduto();
        produto.setEstoque(produto.getEstoque() - model.getQuantidade());
        produtoRepository.save(produto);

        repository.deleteById(id);
    }

    public EntradaResponseDto mapToDto(EntradaModel model) {
        if (model == null) return null;
        return new EntradaResponseDto(
            model.getId(),
            produtoService.mapToDto(model.getProduto()),
            model.getQuantidade(),
            model.getData(),
            model.getObservacao(),
            model.getResponsavel()
        );
    }
}
