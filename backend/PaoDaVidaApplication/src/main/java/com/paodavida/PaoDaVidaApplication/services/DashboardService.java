package com.paodavida.PaoDaVidaApplication.services;

import com.paodavida.PaoDaVidaApplication.Repositories.EntradaRepository;
import com.paodavida.PaoDaVidaApplication.Repositories.ProdutoRepository;
import com.paodavida.PaoDaVidaApplication.Repositories.SaidaRepository;
import com.paodavida.PaoDaVidaApplication.dtos.dashboard.EstoqueTotalDto;
import com.paodavida.PaoDaVidaApplication.dtos.dashboard.ResumoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProdutoRepository produtoRepository;
    private final EntradaRepository entradaRepository;
    private static final ZoneId ZONE = ZoneId.of("America/Sao_Paulo");
    private final SaidaRepository saidaRepository;

    @Transactional(readOnly = true)
    public EstoqueTotalDto estoqueTotal() {
        return new EstoqueTotalDto(produtoRepository.somarEstoqueTotal());
    }

    @Transactional(readOnly = true)
    public ResumoDto resumo() {
        LocalDate hoje = LocalDate.now(ZONE);
        Instant inicioHoje = hoje.atStartOfDay(ZONE).toInstant();
        Instant fimHoje = hoje.plusDays(1).atStartOfDay(ZONE).toInstant();
        return new ResumoDto(
                produtoRepository.count(),
                produtoRepository.somarEstoqueTotal(),
                entradaRepository.somarQuantidadeNoPeriodo(inicioHoje, fimHoje),
                saidaRepository.somarQuantidadeNoPeriodo(inicioHoje, fimHoje),
                saidaRepository.somarReceitaNoPeriodo(inicioHoje, fimHoje),
                produtoRepository.countEstoqueCritico()
        );
    }
}
