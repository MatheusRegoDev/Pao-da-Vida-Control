package com.paodavida.PaoDaVidaApplication.services;

import com.paodavida.PaoDaVidaApplication.dtos.saida.SaidaRequestDto;
import com.paodavida.PaoDaVidaApplication.dtos.saida.SaidaResponseDto;
import com.paodavida.PaoDaVidaApplication.models.ProdutoModel;
import com.paodavida.PaoDaVidaApplication.models.SaidaModel;
import com.paodavida.PaoDaVidaApplication.repositories.ProdutoRepository;
import com.paodavida.PaoDaVidaApplication.repositories.SaidaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SaidaService {

    private final SaidaRepository repository;
    private final ProdutoRepository produtoRepository;
    private final ProdutoService produtoService;

    public SaidaService(SaidaRepository repository, ProdutoRepository produtoRepository, ProdutoService produtoService) {
        this.repository = repository;
        this.produtoRepository = produtoRepository;
        this.produtoService = produtoService;
    }

    @Transactional
    public SaidaResponseDto create(SaidaRequestDto dto) {
        SaidaModel model = new SaidaModel();
        model.setQuantidade(dto.quantidade());
        model.setValorUnitario(dto.valorUnitario());
        model.setValorTotal(dto.valorUnitario().multiply(new BigDecimal(dto.quantidade())));
        model.setObservacao(dto.observacao());
        model.setResponsavel(dto.responsavel());
        
        ProdutoModel produto = produtoRepository.findById(dto.produtoId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        model.setProduto(produto);
        
        // Baixa estoque
        produto.setEstoque(produto.getEstoque() - dto.quantidade());
        produtoRepository.save(produto);
        
        model = repository.save(model);
        return mapToDto(model);
    }

    @Transactional(readOnly = true)
    public List<SaidaResponseDto> findAll() {
        return repository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SaidaResponseDto findById(Long id) {
        SaidaModel model = repository.findById(id).orElseThrow(() -> new RuntimeException("Saída não encontrada"));
        return mapToDto(model);
    }

    @Transactional
    public SaidaResponseDto update(Long id, SaidaRequestDto dto) {
        SaidaModel model = repository.findById(id).orElseThrow(() -> new RuntimeException("Saída não encontrada"));
        
        ProdutoModel produto = produtoRepository.findById(dto.produtoId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        
        // Ajusta estoque com a diferença
        int diferenca = dto.quantidade() - model.getQuantidade(); // se aumentou a saída, tira mais do estoque
        if(model.getProduto().getId().equals(produto.getId())) {
            produto.setEstoque(produto.getEstoque() - diferenca);
            produtoRepository.save(produto);
        } else {
            // Se mudou de produto, devolve no antigo e tira no novo
            ProdutoModel antigo = model.getProduto();
            antigo.setEstoque(antigo.getEstoque() + model.getQuantidade());
            produtoRepository.save(antigo);
            
            produto.setEstoque(produto.getEstoque() - dto.quantidade());
            produtoRepository.save(produto);
        }

        model.setProduto(produto);
        model.setQuantidade(dto.quantidade());
        model.setValorUnitario(dto.valorUnitario());
        model.setValorTotal(dto.valorUnitario().multiply(new BigDecimal(dto.quantidade())));
        model.setObservacao(dto.observacao());
        model.setResponsavel(dto.responsavel());
        
        model = repository.save(model);
        return mapToDto(model);
    }

    @Transactional
    public void delete(Long id) {
        SaidaModel model = repository.findById(id).orElseThrow(() -> new RuntimeException("Saída não encontrada"));
        
        // Devolve estoque
        ProdutoModel produto = model.getProduto();
        produto.setEstoque(produto.getEstoque() + model.getQuantidade());
        produtoRepository.save(produto);

        repository.deleteById(id);
    }

    public SaidaResponseDto mapToDto(SaidaModel model) {
        if (model == null) return null;
        return new SaidaResponseDto(
            model.getId(),
            produtoService.mapToDto(model.getProduto()),
            model.getQuantidade(),
            model.getValorUnitario(),
            model.getValorTotal(),
            model.getData(),
            model.getObservacao(),
            model.getResponsavel()
        );
    }
}
