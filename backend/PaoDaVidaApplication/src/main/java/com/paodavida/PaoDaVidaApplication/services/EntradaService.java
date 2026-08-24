package com.paodavida.PaoDaVidaApplication.services;

import com.paodavida.PaoDaVidaApplication.Repositories.EntradaRepository;
import com.paodavida.PaoDaVidaApplication.Repositories.ProdutoRepository;
import com.paodavida.PaoDaVidaApplication.Repositories.specifications.EntradaSpecification;
import com.paodavida.PaoDaVidaApplication.dtos.entradas.EntradaRequestDto;
import com.paodavida.PaoDaVidaApplication.dtos.entradas.EntradaResponseDto;
import com.paodavida.PaoDaVidaApplication.dtos.entradas.EntradaEstatisticaDto;
import com.paodavida.PaoDaVidaApplication.exception.NotFoundException;
import com.paodavida.PaoDaVidaApplication.models.EntradaModel;
import com.paodavida.PaoDaVidaApplication.models.ProdutoModel;
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
public class EntradaService {

    private final EntradaRepository entradaRepository;
    private final ProdutoRepository produtoRepository;
    private static final ZoneId ZONE = ZoneId.of("America/Sao_Paulo");

    @Transactional
    public EntradaResponseDto create(EntradaRequestDto dto) {
        ProdutoModel produto = produtoRepository.findById(dto.produtoId())
                .orElseThrow(() -> new NotFoundException("Produto não encontrado"));

        UsuarioModel responsavel = usuarioAutenticado();

        EntradaModel entrada = EntradaModel.builder()
                .produto(produto)
                .quantidade(dto.quantidade())
                .responsavel(responsavel)
                .observacao(dto.observacao())
                .build();

        EntradaModel saved = entradaRepository.save(entrada);

        produto.setEstoque(produto.getEstoque().add(dto.quantidade()));
        produtoRepository.save(produto);

        return mapToResponseDto(saved);
    }

    @Transactional(readOnly = true)
    public Page<EntradaResponseDto> findAll(String nomeProduto, Long produtoId, Pageable pageable) {
        Specification<EntradaModel> spec = Specification
                .where(EntradaSpecification.comNomeProduto(nomeProduto))
                .and(EntradaSpecification.comProduto(produtoId));

        return entradaRepository.findAll(spec, pageable)
                .map(this::mapToResponseDto);
    }

    @Transactional(readOnly = true)
    public EntradaEstatisticaDto estatisticas() {
        LocalDate hoje = LocalDate.now(ZONE);
        Instant inicioHoje = hoje.atStartOfDay(ZONE).toInstant();
        Instant fimHoje = hoje.plusDays(1).atStartOfDay(ZONE).toInstant();
        Instant inicioMes = hoje.withDayOfMonth(1).atStartOfDay(ZONE).toInstant();
        Instant fimMes = hoje.withDayOfMonth(1).plusMonths(1).atStartOfDay(ZONE).toInstant();

        BigDecimal unidadesHoje = entradaRepository.somarQuantidadeNoPeriodo(inicioHoje, fimHoje);
        long registrosHoje = entradaRepository.contarNoPeriodo(inicioHoje, fimHoje);
        BigDecimal unidadesNoMes = entradaRepository.somarQuantidadeNoPeriodo(inicioMes, fimMes);
        long totalRegistros = entradaRepository.count();

        return new EntradaEstatisticaDto(unidadesHoje, registrosHoje, unidadesNoMes, totalRegistros);
    }



    private UsuarioModel usuarioAutenticado() {
        return (UsuarioModel) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private EntradaResponseDto mapToResponseDto(EntradaModel entrada) {
        return new EntradaResponseDto(
                entrada.getId(),
                entrada.getProduto().getId(),
                entrada.getProduto().getNome(),
                entrada.getQuantidade(),
                entrada.getResponsavel().getId(),
                entrada.getResponsavel().getNome(),
                entrada.getObservacao(),
                entrada.getDataCriacao()
        );
    }
}
