package com.paodavida.PaoDaVidaApplication.controllers;

import com.paodavida.PaoDaVidaApplication.dtos.relatorios.CategoriaVendaDto;
import com.paodavida.PaoDaVidaApplication.dtos.relatorios.RelatorioGraficoDto;
import com.paodavida.PaoDaVidaApplication.dtos.relatorios.RelatorioResumoDto;
import com.paodavida.PaoDaVidaApplication.dtos.relatorios.TopProdutosDto;
import com.paodavida.PaoDaVidaApplication.services.RelatorioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/relatorios")
public class RelatorioController {

    private final RelatorioService relatorioService;

    @GetMapping("/resumo")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'GERENTE')")
    public ResponseEntity<RelatorioResumoDto> resumo() {
        return ResponseEntity.ok(relatorioService.resumoUltimos7dias());
    }

    @GetMapping("/grafico")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'GERENTE')")
    public ResponseEntity<RelatorioGraficoDto> grafico(@RequestParam(defaultValue = "DIARIO") RelatorioService.Periodo periodo) {
        return ResponseEntity.ok(relatorioService.grafico(periodo));

    }

    @GetMapping("/vendas-por-categoria")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'GERENTE')")
    public ResponseEntity<List<CategoriaVendaDto>> vendasPorCategoria() {
        return ResponseEntity.ok(relatorioService.vendasPorCategoria());
    }

    @GetMapping("/top-produtos")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'GERENTE')")
    public ResponseEntity<List<TopProdutosDto>> topProdutos() {
        return ResponseEntity.ok(relatorioService.topProdutos());
    }

}
