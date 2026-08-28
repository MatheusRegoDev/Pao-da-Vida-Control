package com.paodavida.PaoDaVidaApplication.services;

import com.paodavida.PaoDaVidaApplication.Repositories.ProdutoRepository;
import com.paodavida.PaoDaVidaApplication.Repositories.SaidaRepository;
import com.paodavida.PaoDaVidaApplication.Repositories.specifications.SaidaSpecification;
import com.paodavida.PaoDaVidaApplication.dtos.saidas.SaidaEstatisticaDto;
import com.paodavida.PaoDaVidaApplication.dtos.saidas.SaidaRequestDto;
import com.paodavida.PaoDaVidaApplication.dtos.saidas.SaidaResponseDto;
import com.paodavida.PaoDaVidaApplication.exception.EstoqueInsuficienteException;
import com.paodavida.PaoDaVidaApplication.exception.NotFoundException;
import com.paodavida.PaoDaVidaApplication.models.ProdutoModel;
import com.paodavida.PaoDaVidaApplication.models.SaidaModel;
import com.paodavida.PaoDaVidaApplication.models.UsuarioModel;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
public class SaidaService {

    private final SaidaRepository saidaRepository;
    private final ProdutoRepository produtoRepository;
    private static final ZoneId ZONE = ZoneId.of("America/Sao_Paulo");

    @Transactional
    public SaidaResponseDto create(SaidaRequestDto saidaRequestDto){
        ProdutoModel produto = produtoRepository.findById(saidaRequestDto.produtoId())
                .orElseThrow(() -> new NotFoundException("Produto não encontrado"));

        if(produto.getEstoque().compareTo(saidaRequestDto.quantidade()) < 0){
            throw new EstoqueInsuficienteException( "Estoque insuficiente para o produto '" + produto.getNome() +
                    "'. Disponível: " + produto.getEstoque() + ", solicitado: " + saidaRequestDto.quantidade());
        }

        UsuarioModel responsavel = usuarioAutenticado();

        BigDecimal valorUnitario = produto.getPreco();
        BigDecimal valorTotal = valorUnitario.multiply(saidaRequestDto.quantidade());

        SaidaModel saida = SaidaModel.builder()
                .produto(produto)
                .quantidade(saidaRequestDto.quantidade())
                .valorUnitario(valorUnitario)
                .valorTotal(valorTotal)
                .responsavel(responsavel)
                .observacao(saidaRequestDto.observacao())
                .build();

        SaidaModel savedSaida = saidaRepository.save(saida);
        produto.setEstoque(produto.getEstoque().subtract(saidaRequestDto.quantidade()));
        produtoRepository.save(produto);

        return mapToResponseDto(savedSaida);
    }

    @Transactional(readOnly = true)
    public Page<SaidaResponseDto> findAllWithFilters(String nomeProduto, Long produtoId, Pageable pageable) {
        Specification<SaidaModel> specification = Specification
                .where(SaidaSpecification.comNomeProduto(nomeProduto))
                .and(SaidaSpecification.comProduto(produtoId));

        return saidaRepository.findAll(specification, pageable).map(this::mapToResponseDto);
    }

    @Transactional(readOnly = true)
    public SaidaEstatisticaDto estatistica() {
        LocalDate hoje = LocalDate.now(ZONE);
        Instant inicioHoje = hoje.atStartOfDay(ZONE).toInstant();
        Instant fimHoje = hoje.plusDays(1).atStartOfDay(ZONE).toInstant();
        Instant inicioMes = hoje.withDayOfMonth(1).atStartOfDay(ZONE).toInstant();
        Instant fimMes = hoje.withDayOfMonth(1).plusMonths(1).atStartOfDay(ZONE).toInstant();

        BigDecimal receitaHoje = saidaRepository.somarReceitaNoPeriodo(inicioHoje, fimHoje);
        BigDecimal unidadesHoje = saidaRepository.somarQuantidadeNoPeriodo(inicioHoje, fimHoje);
        BigDecimal receitaMes = saidaRepository.somarReceitaNoPeriodo(inicioMes, fimMes);
        long totalRegistros = saidaRepository.count();

        BigDecimal ticketMedio = totalRegistros == 0
                ? BigDecimal.ZERO
                : receitaMes.divide(BigDecimal.valueOf(totalRegistros), 2, java.math.RoundingMode.HALF_UP);

        return new SaidaEstatisticaDto(receitaHoje, unidadesHoje, receitaMes, ticketMedio, totalRegistros);
    }

    @Transactional
    public SaidaResponseDto update(Long id, SaidaRequestDto dto) {
        SaidaModel saida = saidaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Saída não encontrada"));

        ProdutoModel produtoAntigo = saida.getProduto();
        BigDecimal quantidadeAntiga = saida.getQuantidade();

        // Devolve ao estoque a quantidade da venda antiga
        produtoAntigo.setEstoque(produtoAntigo.getEstoque().add(quantidadeAntiga));
        produtoRepository.save(produtoAntigo);

        ProdutoModel produtoNovo = produtoRepository.findById(dto.produtoId())
                .orElseThrow(() -> new NotFoundException("Produto não encontrado"));

        if (produtoNovo.getEstoque().compareTo(dto.quantidade()) < 0) {
            throw new EstoqueInsuficienteException(
                    "Estoque insuficiente para o produto '" + produtoNovo.getNome() +
                            "'. Disponível: " + produtoNovo.getEstoque() + ", solicitado: " + dto.quantidade());
        }

        BigDecimal valorUnitario = produtoNovo.getPreco();
        BigDecimal valorTotal = valorUnitario.multiply(dto.quantidade());

        produtoNovo.setEstoque(produtoNovo.getEstoque().subtract(dto.quantidade()));
        produtoRepository.save(produtoNovo);

        saida.setProduto(produtoNovo);
        saida.setQuantidade(dto.quantidade());
        saida.setValorUnitario(valorUnitario);
        saida.setValorTotal(valorTotal);
        saida.setObservacao(dto.observacao());

        SaidaModel atualizado = saidaRepository.save(saida);
        return mapToResponseDto(atualizado);
    }



    private UsuarioModel usuarioAutenticado() {
        return (UsuarioModel) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private SaidaResponseDto mapToResponseDto(SaidaModel saida) {
        return new SaidaResponseDto(
                saida.getId(),
                saida.getProduto().getNome(),
                saida.getQuantidade(),
                saida.getValorUnitario(),
                saida.getValorTotal(),
                saida.getResponsavel().getNome(),
                saida.getObservacao(),
                saida.getDataCriacao()
        );
    }
}
